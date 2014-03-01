/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {

    $.fn.twitterResult = function(settings) {
        console.log("entry function twitter result");
        return this.each(function() {
            var $results = $(this);
            //console.log("$results");
            //console.log($results);
            var $actions = $.fn.twitterResult.actions = $.fn.twitterResult.actions || $.fn.twitterResult.createActions();
            var $a = $actions.clone().prependTo($results);
            var term = settings.term;
            $results.find("span.search_term").text(term);
            $.each(["refresh", "populate", "remove", "collapse", "expand"], function(i, ev) {
                $results.on(ev, {
                    term: term
                }, $.fn.twitterResult.events[ ev ]);
            });

            // use the class of each action to figure out
            // which event it will trigger on the results panel

            $a.find("li").click(function() {
                // pass the li that was clicked to the function
                // so it can be manipulated if needed
                $results.trigger($(this).attr("class"), [$(this)]);
            });
        });
    };

    $.fn.twitterResult.createActions = function() {
        return $("<ul class='actions' />").append(
                "<li class='refresh'>Refresh</li>" +
                "<li class='remove'>Remove</li>" +
                "<li class='collapse'>Collapse</li>"
                );
    };

    $.fn.twitterResult.events = {
        refresh: function(e) {
            // indicate that the results are refreshing
            var $this = $(this).addClass("refreshing");

            $this.find("p.tweet").remove();
            $results.append("<p class='loading'>Loading...</p>");

            // get the twitter data using jsonp
            $.getJSON("https://api.twitter.com/1.1/search/tweets.json?q=" + escape(e.data.term) + "&rpp=5&callback=?", function(json) {
                $this.trigger("populate", [json]);
            });
        },
        populate: function(e, json) {
            var results = json.results;
            var $this = $(this);

            $this.find("p.loading").remove();
            $.each(results, function(i, result) {
                var tweet = "<p class='tweet'>" +
                        "<a href='http://twitter.com/" +
                        result.from_user +
                        "'>" +
                        result.from_user +
                        "</a>: " +
                        result.text +
                        " <span class='date'>" +
                        result.created_at +
                        "</span>" +
                        "</p>";

                $this.append(tweet);
            });

            // indicate that the results are done refreshing
            $this.removeClass("refreshing");
        },
        remove: function(e, force) {
            if (!force && !confirm("Remove panel for term " + e.data.term + "?")) {
                return;
            }
            $(this).remove();

            // indicate that we no longer have a panel for the term
            search_terms[ e.data.term ] = 0;
        },
        collapse: function(e) {
            $(this).find("li.collapse")
                    .removeClass("collapse")
                    .addClass("expand")
                    .text("Expand");

            $(this).addClass("collapsed");
        },
        expand: function(e) {
            $(this).find("li.expand")
                    .removeClass("expand")
                    .addClass("collapse")
                    .text("Collapse");

            $(this).removeClass("collapsed");
        }

    };

    $("#twitter").on("getResults", function(e, term)
    {
        // make sure we don't have a box for this term already
        console.log("get results triggered");
        var search_terms = $("search_terms");
        if (!search_terms[ term ]) {
            console.log("looking for a new item");
            var $this = $(this);
            var $template = $this.find("div.template");

            // make a copy of the template div
            // and insert it as the first results box
            $results = $template.clone()
                    .removeClass("template")
                    .insertBefore($this.find("div:first"))
                    .twitterResult({
                        "term": term
                    });

            // load the content using the "refresh"
            // custom event that we bound to the results container
            $results.trigger("refresh");

            search_terms[ term ] = 1;
        }
    }).on("getTrends", function(e) {
        var $this = $(this);

        $.getJSON("http://search.twitter.com/trends.json?callback=?", function(json) {
            var trends = json.trends;
            $.each(trends, function(i, trend) {
                $this.trigger("getResults", [trend.name]);
            });
        });
    });


    $("form").submit(function(event) {
        console.log("handling submit");
        var term = $("#search_term").val();
        console.log("value is " + term);
        $("#twitter").trigger("getResults", [term]);
        event.preventDefault();
    });

    $("#get_trends").click(function() {
        $("#twitter").trigger("getTrends");
    });

    $.each(["refresh", "expand", "collapse"], function(i, ev) {
        console.log(".each");
        $("#" + ev).click(function(e) {
            $("#twitter div.results").trigger(ev);
        });
    });

    $("#remove").click(function(e) {
        if (confirm("Remove all results?")) {
            $("#twitter div.results").trigger("remove", [true]);
        }
    });

});
