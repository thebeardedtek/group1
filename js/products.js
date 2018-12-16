$(document).ready(function() {
    function getListOfBooks(){
        var books = $.get('js/products.json').then(function(response){

            var bookList = response.data;
            var output = '';

            bookList.forEach(function(book){
                    output += `
                    <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-2">
                        <picture>
                            <img src="${book.bookCover}">
                        </picture>
                        <div class="add-to-cart-div">
                            <button onclick="toggleAddCartClass(${book.productId}, '${book.name}', '${book.author}', ${book.onSale}, '${book.price}', '${book.excerpt}', '${book.bookCover}')" id="add-to-cart-${book.productId}" class="btn btn-primary add-to-cart-${book.productId}" data-product-id="${book.productId}">
                                Add To Cart
                            </button>
                        </div>
                        
                    </div> 
                `;

                $('#other-products-output').html(output); 
            })        
        });
    }
    getListOfBooks();

    var booksInCart = [];


    window.toggleAddCartClass = function (id, name, author, onSale, price, excerpt, bookCover){

        $('#menu-cart').css('display', 'none');
        
        $('#add-to-cart-' + id).toggleClass('add-to-cart-green');

        var hasActiveClass = $('#add-to-cart-' + id).hasClass('add-to-cart-green');
        if(hasActiveClass){
            
            var book = {};
            book.productId = id;
            book.name = name;
            book.author = author;
            book.onSale = onSale;
            book.price = price;
            book.excerpt = excerpt;
            book.bookCover = bookCover;
            booksInCart.push(book);
        } else {
            
            for(let x of booksInCart){
                if(x.productId === id){
                    let bookToRemove = booksInCart.indexOf(x);
                    booksInCart.splice(bookToRemove,1);
                }
            }
            
        }

        event.preventDefault();
        event.stopPropagation();
        console.log('booksInCart', booksInCart);
    }

    window.removeFromCart = function(id){

        for(let x of booksInCart){
            if(x.productId === id){
                let bookToRemove = booksInCart.indexOf(x);
                booksInCart.splice(bookToRemove,1);
            }
        }

        $('#add-to-cart-' + id).removeClass('add-to-cart-green');

        getCartDetails();
        getCartTotals();

    }

    function getCartDetails(){
        if(booksInCart && booksInCart.length > 0){
            var cartOutput = '';

            booksInCart.forEach(function(bookInCart){

                bookInCart.excerpt = bookInCart.excerpt.slice(0,100);
                cartOutput += `
                    <div class="cart-img">
                        <picture>
                            <img src="${bookInCart.bookCover}">
                        </picture>
                        <div class="cart-details">
                            <div class="cart-excerpt truncate">${bookInCart.excerpt}...</div>
                            <div class="cart-actions">
                                <span class="cart-quantity">Quantity 1</span>
                                <span class="cart-price">$${bookInCart.price}</span>
                                <button onclick="removeFromCart(${bookInCart.productId})" class="btn btn-primary">Remove</button>
                            </div>
                        </div>
                    </div>
                    `

                $('#cart-output').html(cartOutput);
            });

        } else {
            var noDetails = `
                <div class="no-items">You Have No Items In Cart</div>
            `
            $('#cart-output').html(noDetails);
        }
    }

    function getCartTotals(){
        var prices = [];
        var totalCartPrice = null;

        booksInCart.forEach(function(bookPrice){
            totalCartPrice += Number(bookPrice.price);
        });

        var totalCartQuantity = booksInCart.length;

        if(totalCartPrice && totalCartPrice !== null){
            $('#cart-total-price').html('Total $' + totalCartPrice);
            $('#cart-total-quantity').html('You Have ' + totalCartQuantity + ' Item(s) In Your Cart');
        } else {
            $('#cart-total-price').html('Total $0');
            $('#cart-total-quantity').html('You Have 0 Item(s) In Your Cart');
        }

        
    }

    window.toggleShowCart = function (){
        $('#menu-cart').toggle().toggleClass('animated slideInLeft');

        getCartDetails();
        getCartTotals();

        event.preventDefault();
        event.stopPropagation();
    }

    window.toggleShowChat = function(){
        $('#chat i').toggleClass('chat-active');

        $('#chat-box').toggle().toggleClass('animated slideInUp');
    }

});