$(document).ready(function(){

	$('#comment_form').on('submit', function(){

		var item = $('input[name=item]', this);
		var comment = {item: item.val()};

		$.ajax({
			type: 'GET',
			url: '/comments/' + comment.item,
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

			}
		});

		return false;
	});
  
});
  