// modern Navigation bar code start here
const navSlide = () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    //toggle nav
    burger.addEventListener('click', () => {
        console.log(nav.classList.contains('nav-active'))
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



//eventListeners
function eventListeners() {
    //adding to cart
    products.addEventListener('click', buyIceCream);

    //removing from cart
    shoppingCartContent.addEventListener('click', removeCourse);

    //empty the cart
    emptyCartBtn.addEventListener('click', emptyCart);


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
    const productInfo = {
        title: product.querySelector('h3').textContent.trim(),
        image: product.querySelector('img').src,
        price: product.querySelector('.price').textContent,
        id: product.querySelector('button').getAttribute('data-id')
    }
    addToCart(productInfo);
}

function addToCart(productInfo) {

    //check if this product added before? or not!
    // for (const el of document.querySelectorAll('.remove-from-cart')) {
        
    //     // console.log(document.querySelectorAll('.remove-from-cart'))

    //     if(el.getAttribute.dataset.id === productInfo.id){
    //         console.log('hi')
    //     }
        
    // }

    // create a row
    let row = document.createElement('tr');

    //append data to row
    row.innerHTML = `
    <tr>
    <td> <img src=" ${productInfo.image}" width= "60px"></td>
    <td>${productInfo.title}</td>
    <td>${productInfo.price}</td>
    <td>
    <a class= "remove-from-cart" href="#" data-id="${productInfo.id}">×</a>
    </td>
    </tr>
    `
    shoppingCartContent.appendChild(row);

}


function removeCourse(e) {
    if (e.target.classList.contains('remove-from-cart')) {
        e.target.parentElement.parentElement.remove();
    }
}


function emptyCart() {
    for (const el of document.querySelectorAll('.remove-from-cart')) {
        el.parentElement.parentElement.remove();
        
    }
}