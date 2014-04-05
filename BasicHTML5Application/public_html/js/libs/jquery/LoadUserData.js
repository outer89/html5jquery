/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {

    $.fn.loadUser = function(iduser) {
        console.log("loading user: " + iduser);
        return this.each(function() {
            var $result = $(this);
            //console.log("$result");
            //console.log($result);
            var $actions = $.fn.loadUser.actions =
                    $.fn.loadUser().actions || $.fn.loadUser.createActions();
            var $a = $actions.clone().prependTo($result);

            //per ogni evento nella lista fa il bind agli eventi con il metodo .on
            $.each(["refresh", "populate", "remove", "collapse", "expand"], function(i, ev) {
                $result.on(ev, {
                    id: iduser
                }, $.fn.loadUser.events[ ev ]);
            });


            $a.find("li").click(function() {
                $result.trigger($(this).attr("class"), [$(this)]);

            });

        });
    };
    //aggiunge una lista di azioni al div creato

    $.fn.loadUser.createActions = function() {
        return $("<ul class='actions' />").append(
                "<li class='refresh'>Refresh</li>" +
                "<li class='remove'>Remove</li>" +
                "<li class='collapse'>Collapse</li>"
                );
    };

    $.fn.loadUser.events = {
        refresh: function(e) {
            console.log("REFRESH");
            var $this = $(this).addClass("refreshing");
            //write that you are temporarly loading the items
            $results.append("<p class='loading'>Loading...</p>");
            //get the data calling the web service
            console.log("reading id from data in events: " + e.data.id);
            //get data using json

            jQuery.ajax({
                type: "GET",
                url: "http://localhost:8084/simple-service/webapi/myresource/user/1",
                crossDomain: true,
                data: "json",
                dataType: "json",
                success: function(results) {
                    alert("Success!");
                    $this.trigger("populate", [results]);

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error");
                }
            });

        },
        populate: function(e, data) {
            console.log("POPULATE");
            var result = data.results;
            var $this = $(this);
            $this.find("p.loading").remove();
            console.log(result);
//            var user = "<p class='user'>"
//                    + result.from_user + "  ciao grazie   " + result.text + "</p>";
//            $this.append(user);
            // indicate that the results are done refreshing

            $this.removeClass("refreshing");
        },
        remove: function(e, force) {
            console.log("remove");

        },
        collapse: function(e) {
            console.log("collapse");

        },
        expand: function(e) {
            console.log("expand");
        }


    };

    $("#results").on("loadUser", function(event, iduser) {
        //console.log("loading user");
        //console.log("iduser passed is: " + iduser);
        var $this = $(this);
        //console.log("$this");
        //console.log($this);
        var $user = $this.find("div.users");
        // make a copy of the template div
        // and insert it as the first results box
        $results = $user.clone().
                removeClass("user")
                .insertBefore($this.find("div:first"))
                .loadUser(iduser);

        //chiama la funzine che riempie il div
        $results.trigger("refresh");

    });

    $("form").submit(function(event) {
        //console.log("submit handled");
        var id = $("#user_id").val();
        //console.log("id: " + id);
        $("#results").trigger("loadUser", id);
        event.preventDefault();
    });
    $.each(["refresh", "expand", "collapse"], function(i, ev) {

        $("#" + ev).click(function(e) {
            $("#users div.results").trigger(ev);
        });
    });
});