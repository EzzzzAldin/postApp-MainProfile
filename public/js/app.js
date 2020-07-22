const 
    title = $('#title'),
    body = $('#Body'),
    form = $('form');

$('.creat-post1').on('click ', function (event) {

    event.preventDefault()
    let validTitle = validate(title),
        validBody = validate(body);

    if (validTitle && validBody) {
        $(this).attr('disabled' , true)
        $(this).html('Loading... <i class="fas fa-spinner fa-spin"></i>')
        let post = {title: title.val(), body:body.val()},
            posts = JSON.parse(localStorage.getItem('posts'));

            if (posts !== null) {
                posts.push(post);
                localStorage.setItem('posts', JSON.stringify(posts))
            } else {
                localStorage.setItem('posts', JSON.stringify([post]))
            }

        // form.submit ();
    }

    function validate(input) {
        if (input.val() === '') {
            input.addClass('is-invalid').removeClass('is-valid')
            return false;
        }
            input.removeClass('is-invalid').addClass('is-valid')
            return true;
        }
});
$(document).ready(function () {
    $('.deleteBtn').on('click', function(event) {
        if( !confirm('Are You Sure ?')) {
            event.preventDefault();
        }
    })
})