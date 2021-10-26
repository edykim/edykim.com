---
title: NameValueCollection을 JSON으로 Serialize 하기
author: haruair
type: post
date: "2014-12-03T04:04:11"
history:
  - 
    from: https://www.haruair.com/blog/2543
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: serializing-namevaluecollection-to-json
tags:
  - 개발 이야기
  - csharp
  - NameValueCollection
  - serialize

---
`ConfigurationManager.appSettings`를 `Serialize`해서 다른 곳에 전송하는 것은 어떨까 하는 아이디어를 듣고 코드를 작성해 [Json.NET][1]을 사용해서 `SerializeObject`를 했다. appSettings는 `NameValueCollection` 클래스인데 Dictionary와 같이 serialize 될 것이라 예상했지만 결과는 키값만 배열로 반환했다.

    var col = new System.Collections.Specialized.NameValueCollection(){
        {"a", "Hello"}, {"a", "World"}
    };
    
    Console.WriteLine(JsonConvert.serializeObject(col));
    // return "[\"a\"]"
    

`NameValueCollection`은 하나의 키에 여러개의 값을 가질 수 있는 컬렉션이기 때문에 Dictionary와는 다른 형태로 serialize되도록 `NameObjectCollectionBase`에서 구현되어 있는 것으로 보인다.

    Console.WriteLine(col["a"]);
    // return Hello,World
    

동일한 키라도 각각의 값이 독립적으로 보장되야 한다면 조금 복잡해지겠지만 내 경우에는 위와 같이 `,`로만 구분 되어도 큰 문제가 없는 상황이라서 Dictionary로 변환한 후에 Serialize하는 방법으로 문제를 해결했다.

    var dict = col.AllKeys.ToDictionary(k => k, v => col[v]);
    
    Console.WriteLine(dict["a"]);
    // return Hello,World
    
    Console.WriteLine(JsonConvert.serializeObject(dict));
    // return "{\"a\":\"Hello,World\"}"
    

동일한 키에 여러개의 값을 가지는 상황이라면 JSON에선 키 아래 배열로 변환되어야 의미론에 더 맞는 것 같다. 위와 같은 방법 말고도 더 아름답고 쉽고 시멘틱한 방법이 있을 것 같은데&#8230;

* * *

<blockquote class="twitter-tweet" data-conversation="none" lang="en" style="margin:0 auto;">
  <p>
    <a href="https://twitter.com/haruair">@haruair</a> Use .GetValues() so that you can get string[] instead of comma delimited string. <a href="http://t.co/rFgktacwRP">http://t.co/rFgktacwRP</a>
  </p>
  
  <p>
    &mdash; Justin Yoo (@justinchronicle) <a href="https://twitter.com/justinchronicle/status/539999180303773697">December 3, 2014</a>
  </p>
</blockquote>



`GetValues(key)`를 이용하면 `string[]`으로 반환해준다고 한다. [how to convert NameValueCollection to JSONstring][2]의 코드를 참고하면 되겠다.

 [1]: http://james.newtonking.com/json
 [2]: http://stackoverflow.com/questions/7003740/how-to-convert-namevaluecollection-to-json-string