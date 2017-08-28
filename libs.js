var lcboSearcher = (function (){
  //now we have a closure scope
  let resArr;
  //myKey
  const apikey = "Add your lcbo key here";
  const lcboOptions = {
      url: 'http://lcboapi.com/products',
      'Access-Control-Allow-Headers': true,
      headers: { 'Authorization': `Token ${apikey}` }
  };
  const myInit = {
    method: 'GET',
    headers: lcboOptions
  }

  var searchField, drinkInfo, drinksDisplay;


  var showInfo = function(e){
    e.preventDefault();
    const productInfo = resArr[parseInt(event.target.dataset.key)];
    const {name, alcohol_content, is_seasonal, package, price_in_cents, image_thumb_url} = productInfo;
    const productTable = (
      `<table>
        <tr>
          <td>Name:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td>Alcohol Content:</td>
          <td>${alcohol_content}</td>
        </tr>
        <tr>
          <td>Is Seasonal:</td>
          <td>${is_seasonal}</td>
        </tr>
        <tr>
          <td>Package:</td>
          <td>${package}</td>
        </tr>
        <tr>
          <td>Price:</td>
          <td>$${parseInt(price_in_cents)/100}</td>
        </tr>
        <tr>
          <td>Image:</td>
          <td><img src='${image_thumb_url}'</td>
        </tr>
      </table>`
    );
    drinkInfo.innerHTML = productTable;
  }

  var makeProductCall = function(searchTerm){
    if(searchTerm.length >0 ){
      fetch(`http://lcboapi.com/products?q=${searchTerm}`, myInit.headers)
      .then((res) => res.json())
      .then((data) => {
        const resultsObj = data.result;
        resArr = Object.keys(resultsObj).map((key) => resultsObj[key] );
        const displayElements = resArr.map((key, i) => {
          return `<li><a class='beverage' href="#" data-key=${i}>${key.name}</a></li>`
        })
        .join('');
        drinksDisplay.innerHTML=displayElements;
        const beverageItems = drinksDisplay.querySelectorAll('a.beverage');
        beverageItems.forEach(function(item){
          item.addEventListener('click', function(e){
            e.preventDefault();
            showInfo(e);
          });
        });
      });
    }else{
      drinksDisplay.innerHTML='';
    }
  };

  return {
    initSearcher: function(__searchField, __drinksDisplay, __drinkInfo){
      searchField = __searchField;
      drinksDisplay = __drinksDisplay;
      drinkInfo = __drinkInfo;
      searchField.addEventListener('keyup', (e) => {
        makeProductCall(e.target.value);
      });
    },
  }
}())
