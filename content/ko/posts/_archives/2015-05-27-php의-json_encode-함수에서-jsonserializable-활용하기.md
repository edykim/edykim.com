---
title: PHP의 json_encode() 함수에서 JsonSerializable 활용하기
author: haruair
type: post
date: 2015-05-27T03:33:46+00:00
history:
  - 
    from: https://www.haruair.com/blog/2894
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: using-jsonserializable-in-phps-jsonencode-function
headline:
  - PHP 5.4 이상에서 활용 가능한 JsonSerializable 인터페이스 소개
categories:
  - 개발 이야기
tags:
  - JsonSerializable
  - php

---
PHP에서 데이터를 json 문자열로 변환할 때 `json_encode(mixed $value)` 함수를 사용하게 된다. 이 함수를 이용해 개체를 변환할 때에도 활용할 수 있다. 기본적으로는 클래스에서 public인 프로퍼티에 대해서만 json으로 반환한다. protected나 private, 또는 데이터를 가공해 json으로 반환해야 한다면 해당 클래스에서 `JsonSerializable` 인터페이스를 구성해 어떤 형태로 변환할 것인지 정의할 수 있다. 이 인터페이스는 PHP 5.4.0 이상, PHP 7 에서 지원하고 있다.

    <?php
    class Student {
        public $first_name;
        public $last_name;
        protected $school;
    
        public function __construct($first_name, $last_name, $school) {
            $this->first_name = $first_name;
            $this->last_name = $last_name;
            $this->school = $school;
        }
    }
    
    $haruair = new Student("Edward", "Kim", "WeirdSchool");
    print $haruair;
    
    
    // result :
    // {
    //   "first_name": "Edward",
    //   "last_name": "Kim"
    // }
    ?>
    

public 프로퍼티만 필요로 한 경우라면 별도의 인터페이스 구성 없이도 사용할 수 있다. 다만 대부분의 라이브러리에서 protected 또는 private으로 프로퍼티를 작성하고 `__get()`, `__set()` 매직 메소드를 구현해 사용하고 있고 또 권장하고 있기 때문에 그런 경우엔 다음과 같이 `JsonSerializable` 인터페이스를 활용할 수 있다.

    <?php
    class Student implements JsonSerializable {
        public $first_name;
        public $last_name;
        protected $school;
    
        public function __construct($first_name, $last_name, $school) {
            $this->first_name = $first_name;
            $this->last_name = $last_name;
            $this->school = $school;
        }
    
        public function jsonSerialize() {
            return [
                'full_name' => "{$this->first_name}, {$this->last_name}",
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'school' => $this->school,
            ];
        }
    }
    
    $haruair = new Student("Edward", "Kim", array("Jeju Univ", "Weird School"));
    print $haruair;
    
    
    // result :
    // {
    //   "full_name": "Edward, Kim",
    //   "first_name": "Edward",
    //   "last_name": "Kim",
    //   "school": [
    //       "Jeju Univ",
    //       "Weird School"
    //   ]
    // }
    ?>
    

변환하는 과정에서 json 문자열을 추가하거나 데이터의 구조를 변환하는 등 다양한 형태로 활용할 수 있다.

### 더 읽을 거리

  * [json_encode][1]
  * [JsonSerializable interface][2]

 [1]: http://php.net/manual/en/function.json-encode.php
 [2]: http://php.net/manual/en/class.jsonserializable.php