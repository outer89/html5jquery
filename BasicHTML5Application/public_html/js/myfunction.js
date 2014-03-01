/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
    $("p").click(function() {

        console.log("you cliecked a paragraph");
    });
    $("button").click(function() {
        alert("you clicked a button");

    });
    $("button").addClass("alert").appendTo(document.body);

    $("button.alert").click(function() {
        console.log("a button with the alert class was clicked");
    });
    // Event setup using the `.on()` method with data
    $("input").on(
            "change",
            {foo: "bar"}, // associate data with event binding
    function(eventObject) {
        console.log("An input value has changed! ", eventObject.data.foo);
       // var input = $("input");
       // input.val("trolol");
    }
            
    );
});
