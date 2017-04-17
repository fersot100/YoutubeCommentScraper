
const fetchCommentPage = require('youtube-comment-api')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var com, time, fileName, videoId;
var commentCount = 0;
var fs = require('fs');

rl.question('Enter a youtube URL: ', (answer) => {
  // TODO: Log the answer in a database
  videoId = answer.slice(answer.indexOf("=") + 1)
  fileName = ('commentFiles/video=' + videoId + '.txt')
  start()
  rl.close()
});


function start() {
	fs.open(fileName, 'w', (err, fd) => {
	  if (err) {
	    if (err.code === 'EEXIST') {
	      console.error('myfile already exists');
	      return;
	    }
	    throw err;
	  }
	  return;
	});

	fetchCommentPage(videoId)
	  .then(commentPage => {
		data = ('URL: https://www.youtube.com/watch?v=' + videoId + "\n\n")
	  	fs.writeFile(fileName, data, err => {
	  		if(err) {
	  			console.log(err)
	  		}else{
	  			console.log(data)
	  		}
	  	})  	
	    printCommentInfo(commentPage)
	    recursiveRequest(commentPage.nextPageToken)
	  }, error => {
	  	return console.log(error + "\n=============Done================");
	  })
}


function recursiveRequest(nextPageToken) {
	fetchCommentPage(videoId, nextPageToken).then(commentPage => {
	    printCommentInfo(commentPage)
	  }, error => {
	  	return console.log(error + "\n=============Done================");
	  }).then(recursiveRequest(commentPage.nextPageToken))
}

function printCommentInfo(commentPage) {
	var data;
	for (var i = commentPage.comments.length - 1; i >= 0; i--) {
	    	com = commentPage.comments[i]
	    	time = new Date(com.timestamp).toString()
	    	data += ("\n")
	    	data += (com.author + " " + com.authorLink)
	    	data += ("\n")
	  		data += (time + " : " + com.text)
	  		data += ("\n")
	  		commentCount++;
	  	}
	  	fs.writeFile(fileName, data, err => {
	  		if(err) {
	  			console.log(err)
	  		}else{
	  			console.log(data)
	  			console.log("Comment Count: " + commentCount);
	  		}
	  	})  	
}







