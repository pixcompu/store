
window.onload = init;

function init(){
    ajax.expectJsonProperties(['status']);
    ajax.get(
        '../server/action/user/get.php',
        onFetchSuccess,
        onFetchFailure
    );
}

function onFetchSuccess(response){
    var data = response.data;
    showUsers( data );
}

function onFetchFailure(error){
    console.log(error);
}

function showUsers( users ){
    var table = newTable( newTableHeader(['USUARIO','CORREO','TIPO','TELEFONO', '']) );
    for( var i = 0; i < users.length; i++ ){
        var user = users[i];
        if(user['username'] != JSON.parse(cookieManager.getValue('user'))['username']){
            var deleteButton = newButton('X', showDeleteDialog);
            deleteButton.setAttribute('data-id', user['username']);
            var row = newTableRow([ user['username'], user['email'], user['type'], user['phone'], deleteButton]);
            row.setAttribute('data-user', JSON.stringify(user));
            row.onclick = showUpdateForm;
            table.appendChild(row);
        }
    }
    findViewById('users').appendChild(table);
}

function showUpdateForm(){
    var user = JSON.parse(this.getAttribute('data-user'));
    var form = getUserForm();
    notifier.expectsHTMLContent();
    notifier.setTheme( MODAL_BLUE );
    notifier.confirm(
        'Actualizar',
        form.outerHTML,
        function(confirm){
            if( confirm ){
                updateProduct();
            }
        }
    );
    findViewById('username').value = user['username'];
    findViewById('username').disabled = true;
    findViewById('email').value = user['email'];
    findViewById('password').value = user['password'];
    findViewById('type').value = user['type'];
    findViewById('phone').value = user['phone'];
}

function updateProduct() {
    if( validateFormData() ) {
        var formData = getUserFormData();
        ajax.postWithProgress(
            '../server/action/user/update.php',
            formData,
            onUpdateSuccess,
            onUpdateFailure,
            onUpdateProgress
        );
    }
}

function onUpdateProgress( total, current) {
    appendLog('UPDATE', total + 'of' + current);
}

function onUpdateFailure( error ){
    appendLog('UPDATE', error);
}

function onUpdateSuccess(){
    notifier.setTheme( MODAL_GREEN );
    notifier.dontExpectsHTMLContent();
    notifier.alert(
        'Éxito',
        'El usuario ha sido actualizado exitosamente',
        refreshPage
    );
}

function getUserFormData() {
    var formData = new FormData();
    formData.append('username', findViewById('username').value);
    formData.append('email', findViewById('email').value);
    formData.append('password', findViewById('password').value);
    formData.append('type', findViewById('type').value);
    formData.append('phone', findViewById('phone').value);
    return formData;
}

function showDeleteDialog(){
    event.stopPropagation();
    var id = this.getAttribute('data-id');
    notifier.dontExpectsHTMLContent();
    notifier.setTheme( MODAL_RED );
    notifier.confirm(
        'Eliminar',
        'A continuación se eliminara el usuario ' + id + ', ¿Desea Continuar?',
        function(confirm){
            if( confirm ){
                deleteUser(id);
            }
        }
    );
}

function deleteUser(id){
    var params = {};
    params['username'] = id;
    ajax.post(
        '../server/action/user/delete.php',
        params,
        onDeleteSuccess,
        onDeleteFailure
    );
}

function onDeleteSuccess(){
    notifier.dontExpectsHTMLContent();
    notifier.setTheme( MODAL_ORANGE );
    notifier.alert(
        'Eliminacion Exitosa',
        'El usuario ha sido eliminado con exito',
        refreshPage
    );
}

function onDeleteFailure( error ){
    appendLog('DELETE', error);
}

function showRegister(){
    var form = getUserForm();
    notifier.expectsHTMLContent();
    notifier.setTheme( MODAL_BLUE );
    notifier.confirm(
        '¿Desea registrar este usuario?',
        form.outerHTML,
        function( confirm ){
            if( confirm ){
                registerUser();
            }
        }
    );
}

function registerUser(){
    if( validateFormData() ) {
        var formData = getUserFormData();
        ajax.postWithProgress(
            '../server/action/user/new.php',
            formData,
            onRegisterSuccess,
            onRegisterFailure,
            onRegisterProgress
        );
    }

}

function validateFormData(){
    if( findViewById('username').value.length > 0 ) {
        if( findViewById('email').value.length > 0 ) {
            if( findViewById('password').value.length > 0 ) {
                if( findViewById('type').value.length > 0) {
                    if( findViewById('phone').value.length > 0) {
                        return true;
                    }else{
                        alert('Ingresa un número telefónico');
                    }
                }else{
                    alert('Ingresa el tipo de usuario');
                }
            }else{
                alert('El password no puede ser vacio');
            }
        }else{
            alert('El correo electrónico no debe ser vacio');
        }
    }else{
        alert('El nombre de usuario no puede ser vacio');
    }
    return false;
}

function onRegisterSuccess( data ){
    notifier.setTheme( MODAL_GREEN );
    notifier.dontExpectsHTMLContent();
    notifier.alert(
        'Éxito',
        'El usuario ha sido registrado exitosamente',
        refreshPage
    );
}

function onRegisterFailure( error ){
    appendLog('REGISTER', error);
}

function onRegisterProgress( total, current ){
    appendLog('REGISTER', 'Total : ' + total + ' Current : ' + current);
}

function getUserForm() {
    var container = newDiv();
    container.setAttribute('id', 'container');
    var formDiv = newDiv();
    formDiv.setAttribute('id', 'form');
    var breakLine = newElement('br');

    var form = newForm('', 'POST', 'form');
    var username = newFormGroupInput('Nombre de Usuario : ', 'text', 'username', 'username');
    var email = newFormGroupInput('Correo Electronico : ','email', 'email', 'email');
    var password = newFormGroupInput('Password : ', 'password', 'password', 'password');
    var type = newFormGroupSelect('Tipo : ', ['admin', 'user'], 'type', 'type');
    var phone = newFormGroupInput('Telefono : ', 'text', 'phone', 'phone');
    appendItemsTo(
        form,
        [username, breakLine,  email, breakLine, password, breakLine, type, breakLine, phone]
    );
    formDiv.appendChild(form);
    container.appendChild(formDiv);
    return container;
}