$('[data-autocomplete]').each( function() {
    if ($(this).autocomplete && typeof($(this).autocomplete) == "function") {
        var suggestPath = $(this).data("searchpath");
        $(this).autocomplete({
            source: function(request, response) {
                var data = {q: request.term, rm: 'suggest'};
                $.getJSON(suggestPath, data).then(response);
            },
            minLength: 1,
            select: function(event,ui) {
                $(event.target).parents('form').trigger('submit');
            }
        });
    } else {
       console.log('Search-autocomplete disabled');
    }
});
