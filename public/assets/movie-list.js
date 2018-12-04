$(document).ready(function(){

	$('#movie_form').on('submit', function(){
		let item = $('form input');
		let movie = {item: item.val()};

		$.ajax({
			type: 'POST',
			url: '/movies',
			data: movie,
			success: function(){
				location.reload();
			}, 
			error: function(err){

				$.ajax({
					type: 'GET',
					url: '/failure/' + err.status,
					success: function(){
						window.location.href = '/failure/' + err.status;
					}, 
					error: function(){

					}
				});
			}
		});

		return false;

	});  	

	for(let i = 0; i < 100; i++)
	{
		$(`#limovie_${i}`).on('click', function() {

			let movieId = $(this).text().match(/[a-z0-9]{24}/g).join();

			$(`#comment_subform_${i}`).on('submit', function(){
				let item = $(`input[name=item_com_${i}]`, this);
				let comment = {item: item.val(), id: movieId};

				$.ajax({
					type: 'POST',
					url: '/comments',
					data: comment,
					success: function(){
						location.reload();
					},
					error: function(err){
						
						$.ajax({
							type: 'GET',
							url: '/failure/' + err.status,
							success: function(){
								window.location.href = '/failure/' + err.status;
							}, 
							error: function(){
		
							}
						});
					}
				});
				return false;
			});
			
		});
	}

});
