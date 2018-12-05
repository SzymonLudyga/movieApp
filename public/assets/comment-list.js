$(document).ready(function(){

	$('#comment_form').on('submit', function(){

		let item = $('input[name=item]', this);
		let comment = {item: item.val()};

		$.ajax({
			type: 'GET',
			url: '/new_comment/' + comment.item,
			success: function(data) {

				for(let i = 0; i < 100; i++)
				{
					for(let j = 0; j < 100; j++)
					{
						let checking = $(`#licomment_${i}_${j}`).text();
						if(checking.includes(data))
						{
							$(`#licomment_${i}_${j}`).show();
						}
						else
						{
							$(`#licomment_${i}_${j}`).hide();
						}
					}
				}
				$('input[name=item], textarea').val('');

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

	$('li').on('click', function(){
		let item = $(this).text().match(/\b[\w ]{1,100}\b/);
		item = item[0].replace(/ /g, '-');
		let movieId = $(this).text().match(/[a-z0-9]{24}/g).join();

		$.ajax({
			type: 'DELETE',
			url: '/comments/' + item + '&' + movieId,
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
	});
  
});
  