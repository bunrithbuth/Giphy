

const apikey = 'Ed6piFHJMlGrBHXtEj8H2dtxt0RAZDfw'
let words = []
let offset = 0
let favoritedSearchArr = []
let favoritedGifArr = []
let favoritedGifTitleArr = []
let favoritedGifRatingArr = []
let favoritedGifFlag = false


function searchGiphy(searchStr, isAppending) {
    if(isAppending === false){
        $('.gifSection').empty()
        offset = 0
    }else{
        offset = offset + 10
    }

    $('.favoriteButton').empty()
    if(favoritedSearchArr.indexOf(searchStr) > -1){
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
        `)
    }else{
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></span>
        `)
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
            // background-image:url('${item.images.original.url}'); background-size:cover;background-position:center;
            $('.gifSection').append(`
                <div class="col l4 m6 s12">
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="gifCard" data-title='${item.title}' data-rating='${item.rating}' src='${item.images.original_still.url}'>
                            <span class="card-title">Rating: ${item.rating}</span>
                            <span class="card-title playstop" style="top: 0 !important;"><i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">play_arrow</i></span>
                        </div>
                        <div class="card-action center row valign-wrapper">
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                            <div id="favoriteGif" class="valign-wrapper no-margin  col s12">
                                <i class=" small material-icons orange-text no-margin" href="#">add</i>
                                <a class=" favoritegif no-margin" href="#">Favorite</a>
                            </div>
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                            <div id="downloadGif" class="valign-wrapper  no-margin  col s12">
                                <i class="small material-icons orange-text no-margin" href="#">vertical_align_bottom</i>
                                <a class="download no-margin" href="${item.images.original_mp4.mp4}" target="_blank" download>Download</a>
                            </div>
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                        </div>
                    </div>
                </div>
            `)
        })

        $('.gifSection').append(`
            <div class="viewMore waves-effect waves-light hover-cyan-4 rounded col s12">
                <h5 class="viewMoreText" style="font-weight: 900;">View More </h5>
            </div>
        `)
    })
    .catch(function(e){
        console.log(e)
    })
}

function saveSearch(){
    let queryStr = $('.searchString').html()
    if(favoritedGifFlag === false){
        if(favoritedSearchArr.indexOf(queryStr) > -1){ //keyword found favorited searched
            var index = favoritedSearchArr.indexOf(queryStr);
            if (index > -1) {
                favoritedSearchArr.splice(index, 1);

                //local storage
                event.preventDefault();
                localStorage.setItem('savedsearch', favoritedSearchArr)
            }

            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light green tooltipped" data-tooltip="Click to Add Favorite Searches"><i class="material-icons">add</i></span>
            `)

            let selStr = $(document).find(`div[favorited-data='${queryStr}']`)
            $(selStr).remove()

        }else{ //keyword not in favorited search
            favoritedSearchArr.push(queryStr)

            //local storage
            event.preventDefault();
            localStorage.setItem('savedsearch', favoritedSearchArr)

            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light red tooltipped" data-tooltip="Click to Remove from Favorites Searches"><i class="material-icons">clear</i></span>
            `)

            $('.favoritedSearches').append(`
                <div class="col s12 left" favorited-data="${queryStr}">
                    <span class="favoritedButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
                    <h6 class="favoritedText">${queryStr}</h6>
                </div>
            `)

        }
    }
}

function loadSavedSearches(){
    console.log("loading saved searches from local storage")
    //set saved localstorage to favoritedSearchArr
    if(localStorage.getItem('savedsearch')){
        favoritedSearchArr = localStorage.getItem('savedsearch').split(',')
        console.log(favoritedSearchArr)
        favoritedSearchArr.forEach(function(item){
            $('.favoritedSearches').append(`
                <div class="col s12 left" favorited-data="${item}">
                    <span class="favoritedButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
                    <h6 class="favoritedText">${item}</h6>
                </div>
            `)
        })
    }

    let queryStr = $('.searchString').html()
    if(favoritedSearchArr.indexOf(queryStr) > -1){
        $('.favoriteButton').empty()
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light red tooltipped" data-tooltip="Click to Remove from Favorites Searches"><i class="material-icons">clear</i></span>
        `)
    }
}

function loadFavoriteGifs(){
    console.log("loading favoritedgif from local storage")
    //set saved localstorage to favoritedGifArr
    if(localStorage.getItem('savedgifurl')){
        favoritedGifArr = localStorage.getItem('savedgifurl').split(',')
        favoritedGifTitleArr = localStorage.getItem('savedgiftitle').split(',')
        favoritedGifRatingArr = localStorage.getItem('savedgifrating').split(',')
        console.log(favoritedSearchArr)

        if(favoritedGifArr.length > 0){
            $('.favoritedGifs').append(`
                <div class="col s12 left viewAllGifsSection">
                    <span class="viewAllGifButton btn halfway-fab waves-effect waves-light viewAllGifsBtn"><i class="material-icons">apps</i></span>
                    <h6 class="viewAllGifsLink pointer">View All Favorited Gifs</h6>
                </div>
            `)
        }

        favoritedGifArr.forEach(function(item, index){
            $('.favoritedGifs').append(`
            <div class="col s12 left favoritedGifItem" favorited-data="${item}" title="$${favoritedGifTitleArr[index]}" rating="${favoritedGifRatingArr[index]}">
            <span class="favoritedGifButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
            <h6 class="favoritedGifText">${favoritedGifTitleArr}</h6>
        </div>
            `)
        })
    }

    let queryStr = $('.searchString').html()
    if(favoritedSearchArr.indexOf(queryStr) > -1){
        $('.favoriteButton').empty()
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light red tooltipped" data-tooltip="Click to Remove from Favorites Searches"><i class="material-icons">clear</i></span>
        `)
    }
}

// document ready ///////////////////////


$(document).ready(function() {

    //init() should of been here
    loadSavedSearches()
    loadFavoriteGifs()
    searchGiphy('boku no hero', false)

    $(document).on("click",".element", function(){
        searchGiphy('boku no hero', false)
    })

    $(document).on("keypress", "#search_text", function(e) {
        if(e.which == 13) {
            favoritedGifFlag = false
            let queryStr = $('#search_text').val()
            console.log(queryStr)
            searchGiphy(queryStr, false)
        }
    })
    
    //click on search button on right rail
    $(document).on("click", ".searchButton", function(){
        favoritedGifFlag = false
        let queryStr = $('#search_text').val()
        console.log(queryStr)
        searchGiphy(queryStr, false)
    })

    //click view more at the end of gif listings
    $(document).on("click", ".viewMore", function(){
        let queryStr = $('.searchString').html()
        console.log(queryStr)
        searchGiphy(queryStr, true)
    })

    //click on fav search results button
    $(document).on("click", ".favoriteButton", function(){
        saveSearch()
    })

    //click on favorite search remove button
    $(document).on("click", ".favoritedButton", function(){
        let favoritedStr = $(this).parent().children('h6').html()
        let queryStr = $('.searchString').html()

        var index = favoritedSearchArr.indexOf(favoritedStr);
        favoritedSearchArr.splice(index, 1);

        //local storage
        event.preventDefault();
        localStorage.setItem('savedsearch', favoritedSearchArr)
        
        $(this).parent().remove()
        if(favoritedStr === queryStr){
            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></span>
            `)
        }
    })

    //click on favorited gif remove button
    $(document).on("click", ".favoritedGifButton", function(){
        console.log("removing a favorited gif")
        let favoritedGifStr = $(this).parent().attr('favorited-data')

        var index = favoritedGifArr.indexOf(favoritedGifStr);
        favoritedGifArr.splice(index, 1);
        
        $(this).parent().remove()
        if(favoritedGifArr.length === 0){
            $('.viewAllGifsSection').remove()
        }


    })

    //click gif card image to play or pause
    $(document).on("click",".card-image",function() {
        let gif = $(this).children('.gifCard').attr('src')
        let newGif = ''

        let playstop = $(this).children('.playstop')


        if(gif.includes('giphy_s.gif')){
            newGif = gif.replace("giphy_s.gif", "giphy.gif")
            playstop.empty()
            $(playstop).append(`
                <i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">pause</i>
            `)
        }else{
            newGif = gif.replace("giphy.gif", "giphy_s.gif")
            $(playstop).empty()
            $(playstop).append(`
                <i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">play_arrow</i>
            `)
        }
        $(this).children('.gifCard').attr("src", newGif)
    })

    //click on favorite link under gif card
    $(document).on("click", "#favoriteGif", function() {
        if(favoritedGifArr.length === 0){
            $('.favoritedGifs').append(`
            <div class="col s12 left viewAllGifsSection">
                <span class="viewAllGifButton btn halfway-fab waves-effect waves-light viewAllGifsBtn"><i class="material-icons">apps</i></span>
                <h6 class="viewAllGifsLink pointer">View All Favorited Gifs</h6>
            </div>
        `)
        }

        let gifSel = $(this).parent().parent().children('.card-image').children('.gifCard')
        let gif = $(gifSel).attr('src')
        let gifTitle = $(gifSel).attr('data-title')
        let gifRating = $(gifSel).attr('data-rating')

        if(gif.includes('giphy_s.gif')){
            gif = gif.replace("giphy.gif", "giphy_s.gif")
        }

        //do not need to push, would do local storage here! if user refreshes the page and init
        favoritedGifArr.push(gif)
        favoritedGifTitleArr.push(gifTitle)
        favoritedGifRatingArr.push(gifRating)

        //local storage
        event.preventDefault();
        localStorage.setItem('savedgifurl', favoritedGifArr)
        localStorage.setItem('savedgiftitle', favoritedGifTitleArr)
        localStorage.setItem('savedgifrating', favoritedGifRatingArr)

        $('.favoritedGifs').append(`
            <div class="col s12 left favoritedGifItem" favorited-data="${gif}" title="$${gifTitle}" rating="${gifRating}">
                <span class="favoritedGifButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
                <h6 class="favoritedGifText">${gifTitle}</h6>
            </div>
        `)
    })

    //click on favorited search link
    $(document).on("click", ".favoritedText", function() {
        favoritedGifFlag = false
        let queryStr = $(this).text()
        console.log(queryStr)
        searchGiphy(queryStr, false)
    })

    //View all gifs button and link hover
    $(document).on("mouseover", ".viewAllGifsLink, .viewAllGifButton", function () {
        $('.viewAllGifButton').addClass('viewAllGifsBtnhover')
        $( '.viewAllGifsLink').addClass('viewAllGifsLinkhover')
    })

    $(document).on("mouseleave", ".viewAllGifsLink, .viewAllGifButton", function () {
        $('.viewAllGifButton').removeClass('viewAllGifsBtnhover')
        $('.viewAllGifsLink').removeClass('viewAllGifsLinkhover')
    })

    //View all gifs button and link click
    $(document).on("click", ".viewAllGifsLink, .viewAllGifButton", function () {
        let numFavGifs = $('.favoritedGifItem').length
        $('.gifSection').empty()
        $('.favoriteButton').empty()
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light fav">
                <i class="material-icons">apps</i>
            </span>
        `)
        $('.searchString').html('Favorited Gifs')
        
        for(i = 0; i < numFavGifs; i++){
            favoritedGifFlag = true
            let urlGif = $('.favoritedGifItem').eq(i).attr('favorited-data')
            let urlTitle = $('.favoritedGifItem').eq(i).attr('title')
            let urlRating = $('.favoritedGifItem').eq(i).attr('rating')
            let urlMP4 = urlGif.replace("giphy_s.gif", "giphy.mp4")


            $('.gifSection').append(`
                <div class="col l4 m6 s12">
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="gifCard" data-title='${urlTitle}' data-rating='${urlRating}' src='${urlGif}'>
                            <span class="card-title">Rating: ${urlRating}</span>
                            <span class="card-title playstop" style="top: 0 !important;"><i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">play_arrow</i></span>
                        </div>
                        <div class="card-action center row valign-wrapper">
                        <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                        <div id="remFavoriteGif" class="valign-wrapper no-margin  col s12">
                            <i class=" small material-icons orange-text no-margin" href="#">block</i>
                            <a class=" remFavoriteLink no-margin" href="#">Remove Favorite</a>
                        </div>
                        <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                        <div id="downloadGif" class="valign-wrapper  no-margin  col s12">
                            <i class="small material-icons orange-text no-margin" href="#">vertical_align_bottom</i>
                            <a class="download no-margin" href="${urlMP4}" target="_blank" download>Download</a>
                        </div>
                        <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                        </div>
                    </div>
                </div>
            `)
        }
    })


    $(document).on("click", "#remFavoriteGif", function () {
        console.log('removing favorite...')
        console.log(favoritedGifArr)


        let gifSel = $(this).parent().parent().children('.card-image').children('.gifCard')
        let gif = $(gifSel).attr('src')
        let gifTitle = $(gifSel).attr('data-title')
        let gifRating = $(gifSel).attr('data-rating')

        console.log('gif: ' + gif)
        
        var index = favoritedGifArr.indexOf(gif)
        favoritedGifArr.splice(index, 1)
        favoritedGifTitleArr.splice(index, 1)
        favoritedGifRatingArr.splice(index, 1)

        localStorage.setItem('savedgifurl', favoritedGifArr)
        localStorage.setItem('savedgiftitle', favoritedGifTitleArr)
        localStorage.setItem('savedgifrating', favoritedGifRatingArr)

        let selStr = $(document).find(`div[favorited-data='${gif}']`)
        $(selStr).remove()

        
        $(this).parent().parent().remove() //remove from favorite gif results

        if(favoritedGifArr.length === 0){
            $('.viewAllGifsSection').remove()
        }

    })

    //runs tool tips on page
    $('.tooltipped').tooltip();

}) //document ready end