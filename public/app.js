

function getResults() {
    $("#results").empty();
    $.getJSON("/all", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#results").prepend(
                "<p class='data-entry' data-id=" + data[i]._id + "> <span class='dataTitle' data-id=" + data[i]._id + ">"
                + data[i].title + "</span> <span class=delete style='color: red'> X</span> </p>"
            );
        }
    });
};

getResults();

$(document).on("click", "#make-new", function () {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/submit",
        data: {
            title: $("#title").val(),
            note: $("#note").val(),
            created: new Date()
        }
    })
        .then(function (data) {
            $("#results").prepend(
                "<p class='data-entry' data-id=" + data[i]._id + "> <span class='dataTitle' data-id=" + data[i]._id + ">"
                + data[i].title + "</span> <span class=delete style='color: red'> X</span> </p>"
            );
            $("#note").val("");
            $("#title").val("");
        });
});

$("#clear-all").on("click", function () {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clearall",
        success: function (response) {
            $("#results").empty();
        }
    });
});

$(document).on("click", ".delete", function () {
    var selected = $(this).parent();
    $.ajax({
        type: "GET",
        url: "/delete/" + selected.attr("data-id"),
        success: function (response) {
            selected.remove();
            $("#note").val("");
            $("#title").val("");
            // Make sure the #action-button is submit (in case it's update)
            $("#action-button").html("<button  class='btn btn-primary btn-sm' id='make-new'>Submit</button>");

        }
    });
});

$(document).on("click", ".dataTitle", function () {
    var selected = $(this);
    $.ajax({
        type: "GET",
        url: "/find/" + selected.attr("data-id"),
        success: function (data) {
            $("#note").val(data.note);
            $("#title").val(data.title);

            $("#action-button").html("<button  class='btn btn-primary btn-sm' id='updater' data-id='" 
            + data._id + "'>Update</button> <button  class='btn btn-primary btn-sm' id='cancel' data-id='" + data._id + "'>Cancel</button> ");
        }
    });
});

$(document).on("click", "#updater", function () {
    var selected = $(this);
    $.ajax({
        type: "POST",
        url: "/update/" + selected.attr("data-id"),
        dataType: "json",
        data: {
            title: $("#title").val(),
            note: $("#note").val(),
        },
        success: function (data) {
            $("#note").val("");
            $("#title").val("");
            $("#action-button").html("<button  class='btn btn-primary btn-sm' id='make-new'>Submit</button>");
        }
    });
});

$(document).on("click", "#cancel", function () {
    window.history.back();
});



