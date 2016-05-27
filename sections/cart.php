<!DOCTYPE html>
<html lang="en">
<head>
    <?php
    $sectionTitle = "GeekStore - Carrito";
    require_once('header.php');
    ?>
</head>
<body>
<?php require_once('navbar.php'); ?>
<div id="cart"></div>
<div id="options">
    <button id="btn_buy_cart_items">Realizar Compra</button>
    <button id="btn_drop_cart">Vaciar Carrito</button>
    <a href="catalog.php">Seguir Comprando</a>
</div>
<?php require_once('scripts.php'); ?>
<script>

    function dropCart() {
        cookieManager.erase('cart');
        refreshPage();
    }

    function proccessSale(){
        var items = JSON.parse(cookieManager.getValue('cart'));
        var total = 0;
        var ticket = newDiv();
        var table = newTable();
        table.border = '1';
        var headerRow = newTableHeader(['ID', 'NOMBRE', 'PRECIO', 'CANTIDAD', 'SUBTOTAL']);
        table.appendChild(headerRow);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var current = items[key];
                var row = newTableRow([current['id'], current['name'], current['price'], current['cart_quantity'], current['subtotal']]);
                total += current['subtotal'];
                table.appendChild(row);
            }
        }
        var paragraph = newParagraph('TOTAL A PAGAR : $' + total);

        ticket.appendChild(table);
        ticket.appendChild(paragraph);

        notifier.expectsHTMLContent();
        notifier.setTheme(MODAL_GREEN);
        notifier.confirm(
            '¿Desea realizar su compra?',
            ticket.outerHTML,
            function(confirm){
                if(confirm){
                    alert('TODO: Procesar');
                }
            }
        );
    }

    function showCartItems(data) {
        var table = newTable( newTableHeader(['IMAGEN','ID','NOMBRE','PRECIO','CANTIDAD','SUBTOTAL','']) );
        table.border = '1';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var product = data[key];
                var deleteButton = newButton('X', deleteItem);
                deleteButton.setAttribute('data-id', product['id']);
                var image = newImg(product['image']);
                image.style.width = '50px';
                image.style.height = '50px';
                var row =
                    newTableRow([ image, product['id'], product['name'], product['price'], product['cart_quantity'], product['subtotal'], deleteButton]);
                table.appendChild(row);
            }
        }
        findViewById('cart').appendChild(table);
    }

    function deleteItem(){
        var keys = [];
        var id = this.getAttribute('data-id');
        var cart = JSON.parse(cookieManager.getValue('cart'));
        for (var key in cart) {
            if(cart.hasOwnProperty(key)){
                keys.push(key);
            }
        }
        var cartHasOneItem = keys.length == 1;
        if( cartHasOneItem ){
            dropCart();
        }else{
            delete cart[id];
            cookieManager.setValue('cart', JSON.stringify(cart));
            refreshPage();
        }
    }

    window.onload = function(){
        if( cookieManager.check('cart')){
            showCartItems(JSON.parse(cookieManager.getValue('cart')));

            document.getElementById('btn_buy_cart_items').onclick = function(){
                proccessSale();
            };

            document.getElementById('btn_drop_cart').onclick = function(){
                dropCart();
            };


        }else{
            var cartPanel = findViewById('cart');
            cartPanel.appendChild( newH1('Tu carrito esta vacio!') );
            cartPanel.appendChild( newImg('../resources/images/icons/squirtle.png') );
            cartPanel.appendChild( newHyperLink('Vamo a Compra', 'catalog.php'));
            clearElement(findViewById('options'));
        }
    }
</script>
</body>
</html>