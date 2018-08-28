//jquery
/*
$.get('https://api.giphy.com/v1/stickers/trending?api_key=Ed6piFHJMlGrBHXtEj8H2dtxt0RAZDfw')

.then(function(response) {
    console.log(response.data);
    response.data.forEach( item => {
        console.log(item.images.fixed_height_small.url)
        $('.gifSection').append(`
        <img class="rounded" src='${item.images.fixed_height_small.url}'>
        `)
    })
})
.catch(function(e){
    console.log(e)
})
*/
//giphy
const apikey = 'Ed6piFHJMlGrBHXtEj8H2dtxt0RAZDfw'
let words = []
let offset = 0


function searchGiphy(searchStr, isAppending) {
    if(isAppending === false){
        $('.gifSection').empty()
        offset = 0
    }else{
        offset = offset + 10
    }

    $('.searchString').text(searchStr)
    searchStr = searchStr.replace(/ /g, '+');
    let queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + searchStr + '&api_key=' + apikey + '&limit=10' + '&offset=' + offset
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        console.log(response.data);
        $('.viewMore').remove()

        response.data.forEach( item => {
            console.log(item.images.preview_gif.url)
            $('.gifSection').append(`
                <img class="rounded" src='${item.images.original.url}'>
            `)
        })
        $('.gifSection').append(`
            <div class="viewMore hover-cyan-4 rounded col s12">
                <h5 class="viewMoreText" style="font-weight: 900;">View More </h5>
            </div>
        `)
    })
    .catch(function(e){
        console.log(e)
    })
}

$(document).ready(function() {
    searchGiphy('naruto hinata')

    $(document).on("click", ".btn", function(){
        let queryStr = $('#search_text').val()
        console.log(queryStr)
        searchGiphy(queryStr, false)
    })

    $(document).on("click", ".viewMore", function(){
        console.log("here")
        let queryStr = $('.searchString').html()
        console.log(queryStr)
        searchGiphy(queryStr, true)
    })
});