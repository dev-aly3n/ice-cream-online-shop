// modern Navigation bar code start here
const navSlide = () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    //toggle nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        //animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.4}s`;
            }
        });

        //burger animation 
        burger.classList.toggle('toggle');
    });

    document.addEventListener("click", e => {
        if (e.target.matches('.navigation')) return
        nav.classList.remove('nav-active')
        burger.classList.remove('toggle');
        navLinks.forEach((link) => {
            link.style.animation = '';
        });
    });
}
navSlide();
// modern Navigation bar code stop here


//this is the start of our js app


//variables
const products = document.querySelector('#products');
const shoppingCartContent = document.querySelector('#cart-content tbody');
const emptyCartBtn = document.querySelector('#empty-cart');
const netPrice = document.querySelector('#total-price');



//eventListeners
function eventListeners() {
    //adding to cart
    products.addEventListener('click', buyIceCream);

    //removing from cart
    shoppingCartContent.addEventListener('click', removeProduct);

    //empty the cart
    emptyCartBtn.addEventListener('click', emptyCart);

    // change number by arrows
    shoppingCartContent.addEventListener('change', changeNumberByArrows);


    //load content from LS
    document.addEventListener('DOMContentLoaded', loadFromLS);


    document.addEventListener('click', everyClick);



}
eventListeners();

//functions

//adding products to cart
function buyIceCream(e) {
    e.preventDefault();
    //bubbling effect solved by delligation
    if (e.target.classList.contains('add-to-cart-btn')) {
        //access to the whole card info that user clicked
        const product = e.target.parentElement;
        getProductInfo(product);
    }
}

//getting the product info
function getProductInfo(product) {
    let productList = getFromLS();


    //define the info object
    const productInfo = {
        title: product.querySelector('h3').textContent.trim(),
        image: product.querySelector('img').src,
        price: product.querySelector('.price').textContent,
        id: product.querySelector('button').getAttribute('data-id')
    }


    //check if this product added before? or not!
    let found = false;
    let indexOfProduct = -1;
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].id === productInfo.id) {
            found = true;
            indexOfProduct = i;
            break;
        }
    }
    //when the loop find a match then it change the found varibles to true
    // we use found value to know if the product added before or not
    if (found) {
        //getting the number of product that user added to cart - then increase it - and finnaly assign it to the target again
        let number = productList[indexOfProduct].number;
        productList[indexOfProduct].number = Number(number) + 1;
        // submit the change into local storage
        localStorage.setItem('products', JSON.stringify(productList));
        // i dont know why i call it again
        productList = getFromLS();
        // increase the number of the input value if user click add to cart btn of any product that added before
        const changeNumber = document.querySelectorAll('input[type=number]');
        changeNumber.forEach(el => {
            if (el.getAttribute('data-id') === productList[indexOfProduct].id) {
                el.value = productList[indexOfProduct].number;
            }
        });
        console.log()
    } else {
        //if the product doesnt add before then we create it and assign a number 1 to it 
        productInfo.number = 1;
        addToCart(productInfo);
    }
}

// adding the product to the cart by using innerHTML
function addToCart(productInfo) {
    let row = document.createElement('tr');
    //append data to row
    row.innerHTML = `
        <tr>
        <td> <img src=" ${productInfo.image}" width= "60px"></td>
        <td>${productInfo.title}</td>
        <td>${productInfo.price}</td>
        <td>
        <input class="number-of-product" type="number" data-id="${productInfo.id}" min='1' max='99' oninput="validity.valid||(value='');" value="${productInfo.number}">
        </td>
        <td>
        <a class= "remove-from-cart" href="javascript:void(0);" data-id="${productInfo.id}">×</a>
        </td>
        </tr>
        `;
    //append row to the cart content (tbody of the cart)
    shoppingCartContent.appendChild(row);
    //save the created cart element into local storage
    addToLS(productInfo);
    totalPricefunc();

}

// add product to local storage
function addToLS(product) {
    let products = getFromLS();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}
// get products from LS
function getFromLS() {
    let products;
    if (localStorage.getItem('products')) {
        products = JSON.parse(localStorage.getItem('products'));
    } else {
        products = [];
    }
    return products
}

// load from lS
function loadFromLS() {
    let productList = getFromLS();
    let totalPrice = 0;

    //when dom load completely then we add the product of the LS into the cart again
    productList.forEach((productInfo) => {

        totalPrice = totalPrice + Number(productInfo.number) * Number(productInfo.price.split('$')[0]);
        
        // create a row
        let row = document.createElement('tr');
        //append data to row
        row.innerHTML = `
   <tr>
   <td> <img src=" ${productInfo.image}" width= "60px"></td>
   <td>${productInfo.title}</td>
   <td>${productInfo.price}</td>
   <td>
   <input class="number-of-product" type="number" data-id="${productInfo.id}" min='1' max='99' oninput="validity.valid||(value='');" value="${productInfo.number}">
   </td>
   <td>
   <a class= "remove-from-cart" href="javascript:void(0);" data-id="${productInfo.id}">×</a>
   </td>
   </tr>
   `;
        shoppingCartContent.appendChild(row);
    });
    document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);

    everyClick();
}

//removing a single product from cart
function removeProduct(e) {
    let product, productId;
    // delligation method to reach the remove btn and avoiding bubbling effect
    if (e.target.classList.contains('remove-from-cart')) {
        e.target.parentElement.parentElement.remove();
        //using this variables to remove the deleted product from LS
        product = e.target.parentElement.parentElement;
        productId = product.querySelector('a').getAttribute('data-id');
    }
    // remove single product from LS
    let productList = getFromLS();
    productList.forEach((product, index) => {
        if (product.id === productId) {
            productList.splice(index, 1);
        }
    });
    //update the list again after deleting a product
    localStorage.setItem('products', JSON.stringify(productList));
    productList = getFromLS();
    if (productList.length === 0) {
        let totalPrice = 0;
        document.querySelector('#total-price').innerHTML = totalPrice;
        document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);
    } else {
        let totalPrice = 0;
        productList.forEach(i => {
            totalPrice = totalPrice + Number(i.number) * Number(i.price.split('$')[0])
            document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);
        });
    }

}

//removing the whole cart and make it empty
function emptyCart() {
    for (const el of document.querySelectorAll('.remove-from-cart')) {
        el.parentElement.parentElement.remove();
    }
    //remove from LS
    localStorage.clear();
    let totalPrice = 0;
    document.querySelector('#total-price').innerHTML = totalPrice;
    document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);
}

function changeNumberByArrows(e) {
    let productList = getFromLS();
    // delligation method to reach the arrows btn and avoiding bubbling effect
    if (e.target.classList.contains('number-of-product')) {
        let inputData = e.target.parentElement.parentElement.children[3].firstElementChild;
        let totalPrice = 0;
        productList.forEach(el => {
            if (el.id === inputData.getAttribute('data-id')) {
                el.number = inputData.value;
            }

            //to change the total price of the cart after clicking on arrows
            totalPrice = totalPrice + Number(el.number) * Number(el.price.split('$')[0]);
            document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);
        });
        localStorage.setItem('products', JSON.stringify(productList));

    }
}

function totalPricefunc() {
    let productList = getFromLS();
    let totalPrice = 0;
    productList.forEach(i => {
        totalPrice = totalPrice + Number(i.number) * Number(i.price.split('$')[0])
        document.querySelector('#total-price').innerHTML = totalPrice.toFixed(2);
    let fdiscount = totalPrice.toFixed(2) * 0.15;
    document.querySelector('#discount').innerHTML = fdiscount.toFixed(2);
    let fPrice = totalPrice.toFixed(2) - totalPrice.toFixed(2) * 0.15;
    document.querySelector('#final-price').innerHTML = fPrice.toFixed(2);
    });

}

function everyClick() {
let productList = getFromLS();
if(productList.length === 0){
    document.getElementById('empty-cart').innerHTML = 'your cart is empty';
    document.getElementById('checkout-cart').innerHTML = 'Lets choose your IceCream';
    document.getElementById('checkout-cart').href = '#products';
} else {
    document.getElementById('empty-cart').innerHTML = 'empty the cart';
    document.getElementById('checkout-cart').innerHTML = 'Checkout';
    document.getElementById('checkout-cart').href = 'href="javascript:void(0);"';
}
}
