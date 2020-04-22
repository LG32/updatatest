### data为请求参数，url为之前的请求路径，尽量保持接口名一致
1：用户金币数:

```
url: 'https://800321007.littlemonster.xyz/weapp/querygold/',
  data: {
    skey: temp.skey
  }
```

  
2：第一页详细数据

```
url: 'https://800321007.littlemonster.xyz/weapp/firstpage/',
data: {
    city: res.result.address_component.city,
    latitude: that.data.latitude,
    longitude: that.data.longitude
},
```


3：搜索之前有三种搜索，不知为什么，现在实现search就可以了

```
searchUrl: [{
      url: "search"
    }, {
      url: "firstpageanswer"
    }, {
      url: "firstpagedate"
    }],
url: 'https://800321007.littlemonster.xyz/weapp/' + searchUrl + '/',
      method: 'GET',
      data: {
        question: that.data.searchDistrict,
      },
```

      
4、发布任务：
   
```
url: 'https://800321007.littlemonster.xyz/weapp/task/',
data: {
    skey: that.data.skey,
    title: e.detail.value.title,
    description:e.detail.value.description,
    adress: that.data.location.address,
    latitude:that.data.location.latitude,
    longitude:that.data.location.longitude,
    gold: that.data.goldsNumber,
},
```

5、查看回答

```
url: 'https://800321007.littlemonster.xyz/weapp/secondpage/',
method: 'GET',
data: {
    questionID: options.question_id,
},
```

6、选择最佳答案

```
url: 'https://800321007.littlemonster.xyz/weapp/finishtask/',
      data: {
        skey: that.data.skey,
        questionID: that.data.questionId,
        bestAnswerID: bestAnswerID,
      },
```

7、接任务，不知道之前写了两个相近的接口都是在接任务。

```
url:'https://800321007.littlemonster.xyz/weapp/queryaccept/',
    method: 'POST',
    data: {
        questionID: that.data.questionId,
        skey: that.data.skey,
    },
```


```
url: 'https://800321007.littlemonster.xyz/weapp/acceptask/',
      method: 'POST',
      data: {
        questionID: that.data.questionId,
        skey: that.data.skey,
      },
```

8、花金币点赞

```
url: 'https://800321007.littlemonster.xyz/weapp/approve/',
data: {
    skey: that.data.skey,
    questionID: that.data.questionId,
},
```

9、我的发布（9、10、11应该合并成为同一个接口）

```
url: 'https://800321007.littlemonster.xyz/weapp/myrelease/',
      data: {
        skey: that.data.skey
      },
```

10、我的未完成

```
url: 'https://800321007.littlemonster.xyz/weapp/unfinished/',
      data: {
        skey: that.data.skey
      },
```

11、我帮助过

```
url: 'https://800321007.littlemonster.xyz/weapp/helped/',
      data: {
        skey: that.data.skey
      },
```

12、上传照片（format为表格上传的参数）

```
url: 'https://800321007.littlemonster.xyz/weapp/help',
filePath: that.data.pic_list,
name: 'file',
header: {
        "content-type": "multipart/form-data"
    },
    formData: {
        skey: that.data.skey,
        comments:that.data.textAreaValue,
        questionID:that.data.question_id,
    },
```


13、登录
