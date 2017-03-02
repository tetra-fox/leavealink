console.info("You like to look under the hood? Why not help us build the engine? http://leavealink.tk/jobs");
console.log("%cJust kidding. This is maintained by one person. There aren't any job positions available, and there never will be. Sad isn't it.", "color: rgba(0,0,0,0)");

var errorIsExpanded = false;

var errorDialog = document.querySelector(".errorDialog");
var infoDialog = document.querySelector(".infoDialog");
if (!errorDialog.showModal) {
    dialogPolyfill.registerDialog(errorDialog);
}
if (!infoDialog.showModal) {
    dialogPolyfill.registerDialog(infoDialog);
}
$("#closeErr").click(function() {
    errorDialog.close();
    if (errorIsExpanded === true) {
      $("#showErr").click();
    }
});
$("#closeInfo").click(function() {
    infoDialog.close();
});
$("#openInfo").click(function() {
    infoDialog.showModal();
});

$.ajax({
    url: "/info",
    success: function(data) {
        $("#ver, #infoTitle").text("leavealink v" + data.version);
        $("#desc").text(data.description);
    }
});

$("#urlForm").submit(function(e) {
    e.preventDefault();
    $("#p2").css({
        "visibility": "visible"
    });
    $.ajax({
        url: "/submit",
        type: "post",
        data: $("#urlForm").serialize(),
        success: function(data) {
            var progress = document.createElement('div');
            progress.className = "mdl-progress mdl-js-progress mdl-progress__indeterminate";
            componentHandler.upgradeElement(progress);
            $("#main").append(progress);
            window.location.href = data.url;
        },
        error: function(jqXHR) {
            $("#errInfo").text(jqXHR.responseJSON.message);
            $("#superSpookyHackerCode").text(JSON.stringify(jqXHR.responseJSON.error));
            errorDialog.showModal();
            $(".mdl-progress__indeterminate").remove();
        }
    });
});

// http://stackoverflow.com/a/4911660
(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data("toggleclicked", 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));

$("#showErr").clickToggle(function() {
    $("#superSpookyHackerCode").css({
        height: "100px",
        opacity: 1
    });
    $(this).text("Hide error");
    errorIsExpanded = true;
}, function() {
    $("#superSpookyHackerCode").css({
        height: 0,
        opacity: 0
    });
    $(this).text("Show error");
    errorIsExpanded = false;
});

// mdl button focus is rEEAAAAAAALLLLLLLYYYYYYYY dumb
$(".dlgBtn").click(function() {
    $(this).blur();
});
