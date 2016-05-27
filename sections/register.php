<!DOCTYPE html>
<html lang="en">
<head>
    <?php
    $sectionTitle = "GeekStore - Registro";
    require_once('header.php');
    ?>
    <link rel="stylesheet" href="../style/forms.css">
    <style>
        a[href='register.php']{
            background-color: white;
        }
    </style>
</head>
<body>
<?php require_once('navbar.php'); ?>
<div class="container">
    <div class="form">
        <h1>Ingresa tu información</h1>
        <form action="" name="form">
            <input type="text" name="username" id="username" placeholder="Nombre de usuario"><br>
            <input type="text" name="email" id="email" placeholder="Correo electrónico"><br>
            <input type="password" name="password" id="password" placeholder="Contrase&ntilde;a"><br>
            <input type="tel" name="phone" id="phone" placeholder="Teléfono"><br>
            <input type="button" name="btnRegister" class="button" value="Registrarse" >
        </form>
    </div>
</div>
<?php
require_once('scripts.php');
?>
<script>
    window.onload = init;

    function init(){
        if( cookieManager.check('user') ){
            redirectTo('principal.php');
        }

        var btnRegister = document.form.btnRegister;
        btnRegister.onclick = function(){
            if( validateFields()){
                register();
            }
        }
    }

    function validateFields(){
        var form = document.form;
        if( form.username.value.length > 0 ){
            if( form.password.value.length > 0 ){
                if( form.phone.value.length > 0){
                    if( form.email.value.length > 0){
                        return true;
                    }else{
                        alert('El correo no puede ser vacio');
                    }
                }else{
                    alert('El telefono no puede ser vacio');
                }
            }else{
                alert('La contraseña no debe ser vacia');
            }

        }else{
            alert('El campo usuario no puede ser vacio');
        }
        return false;
    }

    function register(){
        var form = document.form;
        var params = {};
        params['username'] = form.username.value;
        params['email'] = form.email.value;
        params['password'] = form.password.value;
        params['phone'] = form.phone.value;
        ajax.expectJsonProperties(['status']);
        ajax.post(
            '../server/action/user/new.php',
            params,
            onRegisterSuccess,
            onRegisterError
        );
    }

    function onRegisterSuccess(json){
        notifier.dontExpectsHTMLContent();
        notifier.setTheme( MODAL_GREEN );
        notifier.alert(
            'Registro Exitoso',
            'Te has registrado exitosamente en GeekStore, inicia sesión y empieza a sacar tu lado Geek',
            function(){
                redirectTo('login.php');
            }
        );
    }
    function onRegisterError(error){
        appendLog('REGISTER', error);
    }
</script>
</body>
</html>
