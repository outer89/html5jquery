/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {

    $.fn.loadUser = function(iduser) {
        console.log("loading user: " + iduser);

    };
    $("#results").on("loadUser", function(event, iduser) {
        console.log("loading user");
        console.log("iduser passed is: " + iduser);
        var search_user = $("search_user");
        var $this = $(this);
        console.log("$this");
        console.log($this);
        var $user = $this.find("div.user");
        // make a copy of the template div
        // and insert it as the first results box
        $results = $user.clone().
                removeClass("user")
                .insertBefore($this.find("div:first"))
                .loadUser(iduser);
        
    });

    $("form").submit(function(event) {
        console.log("submit handled");
        var id = $("#user_id").val();
        console.log("id: " + id);
        $("#results").trigger("loadUser", id);
        event.preventDefault();
    });
    $.each(["refresh","expand","collapse"], function(i,ev){
        
        
    });
});