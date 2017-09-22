const input = $('#urlinput')
const button = $('#downloadbtn')
const list = $('#linklist')

$(input).keyup(e => {
  if (/\.lynda\.com\/.+\/\d+-\d+\.html/.test($(input).val())) {
    $(button).removeAttr('disabled')
  } else {
    $(button).attr('disabled', true)
  }
})

$(button).click(e => {
  clearList()
  $(button).attr('disabled', true)
  $('#downloadall').removeAttr('disabled')

  let url = $(input).val()
  $('#alert').attr('data-message', 'scraping videos...').click()
  $.post('/api/scraper', {url: url}, (videos, status) => {
    $('#alert').attr('data-message', 'loging in...').click()
    $.get('/api/login', (cookie, status) => {
      $('#alert').attr('data-message', 'getting video links...').click()
      videos.forEach(e => {
        $.post('/api/videos', {video: e.id, course: e.course, cookie: cookie}, (data, status) => {
          data = JSON.parse(data)
          console.log(data)
          $('#linklist ul').append(`<li class="list-group-item">
          <a id="downloadlink" onClick="startDownload(this)" class="media-left media-middle" href="${data[0].urls['720']}" download>
            <i class="material-icons pmd-md">file_download</i>
          </a>
  
          <div class="media-body">
              <h3 class="list-group-item-heading">${'#' + e.index + ': ' + e.name}</h3>
              <span class="list-group-item-text"><a target="_blank" href="${data[0].urls['720']}">watch mp4</a></span>
          </div>
          </li>`)
          $('#linklist ul').append($('#linklist ul li').detach().sort(function (a, b) {
            return +/\d+/.exec($(a).find('h3').text())[0] - +/\d+/.exec($(b).find('h3').text())[0]
          }))
        })
      })
    })
  })
})

const startDownload = elem => {
  $('#alert').attr('data-message', 'Downloading ' + $(elem).parent().find('h3').text() + '...').click()
  $(elem).parent().remove()
}

const clearList = () => {
  $('#linklist li').remove()
}
