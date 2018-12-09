$(document).ready(function () {
    
    let storageEnabled = checkStorage();
    let currentCart = getCartData();
    updateCartStatus();

    $('#clearCartGoHome').click(function() {
        clearCartAndGoHome();
    });

    function clearCartAndGoHome() {
        clearCart();
        window.location.replace("../index.html");
    };

    function updateCartStatus() {
        if (currentCart.length > 0) {
            $("#continueCart").prop( "disabled", false );
            $('#viewCartImage').attr('src', "../images/cart-full.png");
            $('#viewCartImage').attr('title', "Total Item(s) " + currentCart.length);
        } else {
            $("#continueCart").prop( "disabled", true );
            $('#viewCartImage').attr('title', "");
            $('#viewCartImage').attr('src', "../images/cart-empty.png");
        }
    }

    $('#viewCart').on('shown.bs.modal', function () {
        hideAlert("alert-warning");
        hideAlert("alert-success");
        generateCart();
    });

    // add to cart click handler
    $('a.cart-add').click(function () {
        try {
            let itemClass = $(this).data("itemclass");
            let itemName = $("div").children("." + itemClass).find(".itemName").text();
            let itemPrice = $("div").children("." + itemClass).find(".itemPrice").text();
            let itemQty = $("div").children("." + itemClass).find(".itemQty").val();
            if (addToCart(itemName, itemPrice, itemQty)) {
                updateCartStatus();
                showSuccess(`${itemQty} ${itemName} added to cart successfully`);
            } else {
                showError('Unable to add to cart');
            }
        } catch (error) {
            showError(error);
        }
        return false;
    });

    function showError(message) {
        hideAlert("alert-success");
        showAlert("alert-warning");
        $('#errorMessage').text(message);
    };

    function showSuccess(message) {
        hideAlert("alert-warning");
        showAlert("alert-success");
        $('#successMessage').text(message);
    };

    function showAlert(alertClass) {
        $('div.' + alertClass).show();
    };

    function hideAlert(alertClass) {
        $('div.' + alertClass).hide();
    };

    // add items to cart
    function addToCart(itemName, itemPrice, itemQty) {
        try {
            // check if item already added
            let shoppingCartItem = currentCart.find(item => item.itemName == itemName);
            if (!shoppingCartItem) {
                // if not available then create new item
                shoppingCartItem = {
                    itemNo: getNextItemNo(),
                    itemName: itemName,
                    itemPrice: itemPrice,
                    itemQty: itemQty,
                    itemTotal: getItemtotal(itemPrice,  itemQty)
                };
                currentCart.push(shoppingCartItem);
            } else {
                // if already added then update price and increment quantity
                shoppingCartItem.itemPrice = itemPrice;
                shoppingCartItem.itemQty = parseInt(shoppingCartItem.itemQty) + parseInt(itemQty);
                shoppingCartItem.itemTotal = getItemtotal(itemPrice,  shoppingCartItem.itemQty);
            }
            // save to local storage
            setCartData(currentCart);
        } catch (error) {
            throw('Unable to add to cart at this time. ' + error.message);
        }
        return true;
    };

    function removeFromCart(itemNo) {
        try {
            if (itemNo == "-1") {
                clearCart();
            } else {
                let itemIndex = currentCart.findIndex((item) => item.itemNo == itemNo);
                currentCart.splice(itemIndex, 1);
                setCartData(currentCart);
            }
            generateCart();
        } catch (error) {
            throw('Unable to remove from cart at this time. ' + error.message);
        }
    };

    function clearCart() {
        currentCart = [];
        setCartData(currentCart);
    }

    function getNextItemNo() {
        let nextItemNo = 1;
        if (currentCart) {
            nextItemNo = currentCart.length;
        }
        return nextItemNo;
    };

    function getItemtotal(price, qty) {
        return parseInt(price.replace(/^\D+/g, '')) * parseInt(qty);        
    };

    // checkk if local storage available
    function checkStorage() {
        if (typeof (Storage) !== "undefined") {
            return true;
        }
        return false;
    };

    // get cart data from localstorage
    function getCartData() {
        let spectrumCart = [];
        // check if local storage is available
        if (storageEnabled) {
            // check if existing cart data is available in local storage
            if (localStorage.getItem("spectrumCart") != null) {
                // load from local storage
                spectrumCart = JSON.parse(localStorage.getItem("spectrumCart"));
            }
        }
        return spectrumCart;
    };

    // set cart data to localstorage
    function setCartData(data) {
        // check if local storage is available
        if (storageEnabled) {
            // save data to local storage
            localStorage.setItem("spectrumCart", JSON.stringify(data));
        }
    };

    function generateCart() {
        //Create a HTML Table element.
        let table = $("<table class='table table-striped' />");
        //table[0].border = "1";

        let header = table[0].createTHead();        
 
        //Add the header row.
        let row = $(header.insertRow(-1));
        let removeCell = $("<th scope='col' style='color:black' />");
        removeCell.html("<a href='#' class='cart-remove' data-itemno='-1'>X</a>");
        row.append(removeCell);

        let nameHeaderCell = $("<th scope='col' style='color:black' />");
        nameHeaderCell.html("Item Name");
        row.append(nameHeaderCell);

        let priceHeaderCell = $("<th scope='col' style='color:black' />");
        priceHeaderCell.html("Price");
        row.append(priceHeaderCell);

        let qtyHeaderCell = $("<th scope='col' style='color:black' />");
        qtyHeaderCell.html("Quantity");
        row.append(qtyHeaderCell);

        let amtHeaderCell = $("<th scope='col' style='color:black; float:right' />");
        amtHeaderCell.html("Amount");
        row.append(amtHeaderCell);

        //Add the data rows.
        let body = table[0].createTBody();
        let cartTotal = 0;
        currentCart.forEach(item => {
            let row = $(body.insertRow(-1));
            let removeCell = $("<td style='color:black' />");
            removeCell.html("<a href='#' class='cart-remove' data-itemno=" + item.itemNo + ">X</a>");
            row.append(removeCell);
    
            let nameCell = $("<td style='color:black' />");
            nameCell.html(item.itemName);
            row.append(nameCell);

            let priceCell = $("<td style='color:black' />");
            priceCell.html(item.itemPrice);
            row.append(priceCell);

            let qtyCell = $("<td style='color:black' />");
            qtyCell.html(item.itemQty);
            row.append(qtyCell);

            let itemTotalCell = $("<td style='color:black; float:right' />");
            itemTotalCell.html(`$${item.itemTotal}`);
            row.append(itemTotalCell);
            cartTotal += parseInt(item.itemTotal);
        });

        let footer = table[0].createTFoot();        
        let frow = $(footer.insertRow(-1));
        let cell0 = $("<td style='color:black' />");
        cell0.html("&nbsp;");
        frow.append(cell0);

        let cell1 = $("<td style='color:black' />");
        cell1.html("&nbsp;");
        frow.append(cell1);

        let cell2 = $("<td style='color:black' />");
        cell2.html("&nbsp;");
        frow.append(cell2);

        let cell3 = $("<td style='color:black' />");
        cell3.html("Cart Total:");
        frow.append(cell3);

        let cell4 = $("<td style='color:black; float:right' />");
        cell4.html(`$${cartTotal}`);
        frow.append(cell4);

        let cartDiv = $("#cartDiv");
        cartDiv.html("");
        cartDiv.append(table);

        updateCartStatus();

        // remove from cart click handler
        $('a.cart-remove').click(function () {
            try {
                let itemNo = $(this).data("itemno");
                removeFromCart(itemNo);
            } catch (error) {
                showError(error);
            }
            return false;
        });
    };
});    
