---
title: "Laravel beyond CRUD 노트"
author: haruair
uuid: "803f87c1-f9e4-474e-9a2a-c483279f0024"
type: post
date: "2022-07-17T14:00:24.520Z"
lang: ko
tags:
  - 개발 이야기
  - laravel
private: true
slug: "laravel-beyond-crud-note"
---

책 [Laravel Beyond CRUD](https://laravel-beyond-crud.com/) 읽고 정리했다. 순수한 아키텍처를 지향하진 않지만 실무에서 난잡한 코드를 사용하지 않으려고 노력했다는 것은 많이 느껴졌다. 기존에 존재하는 용어를 약간 다른 의미로 사용하거나 혼용하는 경우가 많아서 DDD를 배우는 입장으로 읽기에는 적합하지 않을 수 있겠다. 이런 접근 방식도 있구나, 라라벨에서는 이런 방식으로 코드를 작성할 수 있구나 배우는 것에 큰 의미가 있겠다.

비지니스 로직을 분리한다는 얘기는 반복하긴 하지만 도메인 엔티티와 엘로퀸트 모델을 명확하게 분리하지 않고 있기 때문에 결과적으로는 비지니스 로직이 이곳 저곳에 섞이고 있다. 설명은 엘로퀸트의 편리함과 유연성을 아키텍처 때문에 버리는 것은 손해라고 생각하기 때문이라는데 각각의 선택에는 역시 트레이드오프가 있다.

## Actions

```php
class CreateInvoiceLineAction
{
  public function __construct(protected VatCalculator $vatCalculator)
  {}

  public function execute(
    InvoiceLineData $invoiceLineData
  ): InvoiceLine  {
    // ...
  }
}
```

Action 사이 위계가 있는데 동일한 이름으로 묶어두는 방식이라서 장기적으로는 좋은 방식이 아니라고 생각 든다. 차라리 더 도메인에 가까운 네이밍을 선택하고 인터페이스로 만들어야 맞는 부분이지 않을까.

## 모델

### 쿼리 빌더 확장하기

```php
namespace Domain\Invoices\QueryBuilders;

use Domain\Invoices\States\Paid;
use Illuminate\Database\Eloquent\Builder;

class InvoiceQueryBuilderr extends Builder
{
  public function wherePaid(): self
  {
    return $this->whereState('status', Paid::class);
  }
}
```

그리고 모델에 있는 `newEloquentBuilder` 메소드를 덮어쓴다.

```php
namespace Domain\Invoices\Models;

use Domain\Invoices\QueryBuilders\InvoiceQueryBuilder;

class Invoice extends Model
{
  public function newEloquentBuilder($query): InvoiceQueryBuilder
  {
    return new InvoiceQueryBuilder($query);
  }
}
```

### 커스텀 컬랙션 클래스

```php
namespace Domain\Invoices\Collections;

use Domain\Invoices\Models\InvoiceLines;
use Illuminate\Database\Eloquent\Collection;

class InvoiceLineCollection extends Collection
{
  public function creditLines(): self
  {
    return $this->filter(fn (InvoiceLine $invoiceLine) => 
      $invoiceLine->isCreditLine()
    );
  }
}
```

```php
namespace Domain\Invoices\Models;

use Domain\Invoices\Collection\InvoiceLineCollection;

class InvoiceLine extends Model
{
  public function newCollection(
    array $models = []
  ): InvoiceLineCollection {
    return new InvoiceLineCollection($models);
  }

  public function isCreditLine(): bool
  {
    return $this->price < 0.0;
  }
}

$invoice
  ->invoiceLines
  ->creditLines()
  ->map(function (InvoiceLine $invoiceLine) {
    // do work
  });
```

### 이벤트 모델 (hook)

```php
class Invoice
{
  protected $dispatchesEvents = [
    'saving' => InvoiceSavingEvent::class,
    'deleting' => InvoiceDeletingEvent::class,
  ];
}
```

```php
class InvoiceSavingEvent
{
  public Invoice $invoice;

  public function __construct(Invoice $invoice)
  {
    $this->invoice = $invoice;
  }
}
```

```php
use Illuminate\Events\Dispatacher;

class InvoiceSubscriber
{
  private CalculateTotalPriceAction $calculateTotalPriceAction;

  public function __construct(
    CalculateTotalPriceAction $calculateTotalPriceAction
  ) { /* ... */ }

  public function saving(InvoiceSavingEvent $event): void
  {
    $invoice = $event->invoice;

    $invoice->total_price = 
      ($this->calculateTotalPriceAction)($invoice);
  }

  public function subscribe(Dispatacher $dispatcher): void
  {
    $dispatcher->listen(
      InvoiceSavingEvent::class,
      self::class . '@saving'
    );
  }
}
```

그리고 서비스 프로바이더에서 등록한다.

```php
class EventServiceProvider extends ServiceProvider
{
  protected $subscribe = [
    InvoiceSubscriber::class,
  ];
}
```

## DTO

[spatie/data-transfer-object](https://github.com/spatie/data-transfer-object)

```php
// PHP < 8
class CustomerData extends DataTransferObject
{
  public string $name;
  public string $email;
  public Carbon $birth_date;

  public static function fromRequest(
    CustomerRequest $request
  ): self {
    return new self([
      'name' => $request->get('name'),
      'email' => $request->get('email'),
      'birth_date' => Carbon::make(
        $request->get('birth_date')
      ),
    ]);
  } // 또는 별도의 팩토리로 분리
}

$data =  CustomerDate::fromRequest($customerRequest);
```

```php
// PHP >= 8
class CustomerData
{
  public function __construct(
    public string $name,
    public string $mail,
    public  Carbon $birth_date,
  ) {}
}

$data =  CustomerDate::fromRequest(...$customerRequest->validated());
```

## 여러 모델 일괄 생성하기

```php
abstract class Factory
{
  // Concrete factory classes should add a return type
  abstract public function create(array $extra = []);

  public function times(int $times, array $extra = []): Collection
  {
    return collect()
      ->times($times)
      ->map(fn() => $this->create($extra));
  }
}
```

## 팩토리 클래스 예제

```php
class InvoiceFactory
{
  private ?string $status = null;
  public function create(array $extra = []): Invoice
  {
    $inovice = Invoice::create(array_merge(
      [
        'status' => $this->status ?? PendingInvoiceState::class,
      ],
      $extra,
    ));

    if ($invoice->status->isPaid()) {
      PaymentFactory::new()->forInvoice($invoice)->create();
    }

    return $invoice;
  }

  public function paid(): self
  {
    $clone =  clone $this;
    $clone->status = PaidInvoiceState::class;
    return $clone;
  }
}
```

## 테스트 관련

### 라라벨 테스트에 mock 주입하기

```php
namespace Tests\Mocks\Actions;

use Domain\Pdf\Actions\GeneratePdfAction;

class MockGeneratePdfAction extends GeneratePdfAction
{
  public static function setUp(): void
  {
    app()->singleton(
      GeneratePdfAction::class,
      fn () => new self()
    );
  }

  public function execute(ToPdf $toPdf): void
  {
    // do nothing
    return;
  }
}

// `MockGeneratePdfAction::setUp()` 호출하면 주입됨
```

### 커스텀 컬랙션 테스트

```php
/** @test */
public function only_negative_lines()
{
  $factory = InvoiceLineFactory::new();

  $negativeLine = $factory->withItemPrice(-1_00)->create();

  $collection = new InvoiceLineCollection([
    $negativeLine,
    $factory->withItemPrice(1_00)->create(),
  ]);

  $this->assertCount(1, $collection->onlyNegatives());
  $this->assertTrue(
    $negativeLine->is($collection->onlyNegatives()->first())
  );
}
```

### 쿼리 빌더 테스트

```php
/** @test */
public function where_active()
{
  $factory = UnitFactory::new();

  $activeUnit = $factory->active()->create();
  $inactiveUnit = $factory->inactive()->create();

  $this->assertEquals(
    1,
    Unit::query()
      ->whereActive()
      ->whereKey($activeUnit->id)
      ->count()
  );

  $this->assertEquals(
    0,
    Unit::query()
      ->whereActive()
      ->whereKey($inactiveUnit->id)
      ->count()
  );
}
```

### 이벤트 구독 테스트

```php
/** @test */
public function test_saving()
{
  $subscriber = app(InvoiceSubscriber::class);
  $event = new InvoiceSavingEvent(InvoiceFactory::new()->create());
  $subscriber->saving($event);
  $invoice = $event->invoice;
  $this->assertNotNull($invoice->total_price);
}
```

## 뷰모델

```php
class PostFormViewModel
{
  public function __construct(User $user, Post $post = null)
  {
    $this->user = $user;
    $this->post = $post;
  }

  public function post(): Post
  {
    return $this->post ?? new Post;
  }

  public function categories(): Collection
  {
    return Category::allowedForUser($this->user)->get();
  }
}
```

```php
class PostsController
{
  public function create()
  {
    $viewModel = new PostFormViewModel(
      current_user(),
    );
    return view('blog.form', compact('viewModel'));
  }

  public function edit(Post $post)
  {
    $viewModel = new PostFormViewModel(
      current_user(),
      $post,
    );
    return view('blog.form', compact('viewModel'));
  }
}
```

```php
// blog.form.blade.php
<input value="{{ $viewModel->post()->title }}" />
<input value="{{ $viewModel->post()->body }}" />

<select>
  @foreach($viewModel->categories() as $category)
    <option value="{{ $category->id }}">
      {{ $category->name }}
    </option>
  @endforeach
</select>
```

만약 뷰모델에 `Arrayable`을 구현하면 다음처럼 사용 가능하다.

```php
public function create()
{
  $viewModel = new PostFormViewModel(
    current_user()
  );

  return view('blog.form', $viewModel);
}
```

```php
// blog.form.blade.php
<input value="{{ $viewModel->title }}" />
<input value="{{ $viewModel->body }}" />

<select>
  @foreach($categories as $category)
    <option value="{{ $category->id }}">
      {{ $category->name }}
    </option>
  @endforeach
</select>
```

`Responsable`을 구현하면 JSON 데이터로도 반환 가능하다.

```php
public function update(Request $request, Post $post)
{
  return new PostFormViewModel(
    current_user(),
    $post,
  );
}
```

라라벨 리소스와 섞어서 사용하는 것도 가능하다.

```php
class PostViewModel
{
  // ...
  public function values(): array
  {
    return PostResource::make(
      $this->post ?? new Post()
    )->resolve();
  }
}
```

## 쿼리 빌더

[spatie/laravel-query-builder](https://github.com/spatie/laravel-query-builder)

HTTP 리퀘스트에 맞게 쿼리 생성해주는 쿼리 빌더 라이브러리다.

```php
namespace App\Admin\Invoices\Queries;

use Spatie\QueryBuilder\QueryBuilder;

class InvoiceIndexQuery extends QueryBuilder
{
  public function __construct(Request $request)
  {
    $query = Invoice::query()
      ->with([
        'invoicee.contact',
        'invoiceLines.article',
      ]);
    
    parent::__construct($query, $request);

    $this
      ->allowedFilters(
        'number',
        'client',
      )
      ->allowedSorts(
        'number',
      );
  }
}
```

