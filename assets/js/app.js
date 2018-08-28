//jquery
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