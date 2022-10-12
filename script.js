
let i = 0;
let currenti = 0;
let currentSubreddit = 'dankindianmemes'
let subreddit = 'dankindianmemes';

// Variable r is used to detect whether the image content is loading for the first time or it has alread loaded once .If it is already loaded once then we use 'replaceChild' rather than 'appendChild';

let r = false;
// -----------------------------------------------------------------------------------------------

function getVideo() {
    apiUrl = `https://www.reddit.com/r/${subreddit}.json?limit=100`;

    // Adding Loading icon before using Fetch call----------------------------
    loadGif = document.getElementById('loadingGif');
    loadGif.src = 'loadingIcon.gif';
    loadGif.style.height = '15px';
    loadGif.style.width = '15px';

    fetch(apiUrl, { method: 'GET' }).then(response => response.json()).
        then(response => {
              console.log(response)
            console.log(i);
            //  console.log(response.data.children[0].data.media.reddit_video.fallback_url)
            let video = response.data.children[i].data.media.reddit_video.fallback_url;
            let originalPostvid = response.data.children[i].data.permalink;
            //  console.log(video);
            audio = video.slice(0, 37) + "audio.mp4";
            //  console.log('audio :'+ audio);
            //  console.log(i);
            vd = document.getElementById('ck');
            source = document.getElementById('jp');
            source.setAttribute('src', video);
            au = document.getElementById('au');
            source = document.getElementById('ausrc');
            source.setAttribute('src', audio);
            vd.load();
            au.load();
            // Removing Loading Icon after loading Video----------------------------------
            loadGif.src = '';
            loadGif.style.height = '0px';
            loadGif.style.width = '0px';

            // Linking AudioPlayback with Video---------------------------------
            vd.onpause = () => au.pause();
            vd.onplay = () => au.play();
            mut = document.getElementById('mut');

            // Adding Likes and Title and Author for vdieo:--------------------------------------------
            let vidAuthor = response.data.children[i].data.author;
            let vidTitle = response.data.children[i].data.title;
            let vidLike = response.data.children[i].data.ups;

            elementvidTitle = document.getElementById('vidTitle');
            elementvidAuthor = document.getElementById('vidAuthor');
            elementvidLike = document.getElementById('vidLike');
            elementvidAuthor.innerHTML = vidAuthor + " : ";
            elementvidTitle.innerHTML = vidTitle;
            elementvidLike.innerHTML = "Upvotes : " + vidLike;
            // Adding OriginalPost link attached to Upvotes  --------------------------------------
            vidLikeHref = document.getElementById('vidLikeHref');
            vidLikeHref.href = "https://www.reddit.com/"+originalPostvid;


            // Adding memeNo buttons ------>
            memeElement = document.getElementById('memeNo');
            memeElement.innerHTML = 'MEME NO : ' + i;

            // Changing CurrentSubreddit if subreddit is changed in this request after showing video------------
            currentSubreddit = subreddit;
            currenti = i;
            redditName = document.getElementById('redditName');
            redditName.innerHTML = "r/" + currentSubreddit;
        }
        ).catch(err => {
            // console.error('Video not found at '+i);
            getImg();

        })

}



function getImg() {
    // Adding Loading Icon -----------------------------
    loadGif.src = 'loadingIcon.gif';
    loadGif.style.height = '15px';
    loadGif.style.width = '15px';

    fetch(apiUrl, { method: 'GET' }).then(response => response.json()).
        then(response => {

            let imgUrl = response.data.children[i].data.url;
            let originalPostimg = response.data.children[i].data.permalink;
            //  console.log(Img);


            // Making html to show Images,Likes, Author and Title-------------------------------------------------------------------------------
            imageDiv = document.getElementById('imageDiv');

            imageDiv.innerHTML = "<h5 class ='imgHr'>Images will be shown Here</h5><hr><img src ='' id ='imge' class = 'imge' alt ='Loading Error or Image not Found'><div class='imgAaT' id='imgAaT'><span class='imgAuthor' id='imgAuthor'></span><span class='imgTitle' id='imgTitle'></span></div><div class='imgBtns'><a href='' id='imgLikeHref' class='imgLikeHref' target='_blank'><button class='imgLike' id='imgLike'></button></a></div>"

            imge = document.getElementById('imge');
            imge.src = imgUrl;

            // Adding Likes and Title, Author for Img:--------------------------------------------
            let imgAuthor = response.data.children[i].data.author;
            let imgTitle = response.data.children[i].data.title;
            let imgLike = response.data.children[i].data.ups;


            elementimgTitle = document.getElementById('imgTitle');
            elementimgAuthor = document.getElementById('imgAuthor');
            elementimgLike = document.getElementById('imgLike');
            elementimgAuthor.innerHTML = imgAuthor + " : ";
            elementimgTitle.innerHTML = imgTitle;
            elementimgLike.innerHTML = "Upvotes : " + imgLike;
             // Adding OriginalPost link attached to Upvotes in img --------------------------------------
             imgLikeHref = document.getElementById('imgLikeHref');
             imgLikeHref.href = "https://www.reddit.com/"+originalPostimg;



            // Adding memeNo buttons ------>
            memeElement = document.getElementById('memeNo');
            memeElement.innerHTML = 'MEME NO : ' + i;


            // Changing currentSubreddit if changed after showing image-----------------------------
            currentSubreddit = subreddit;
            currenti = i;
            redditName = document.getElementById('redditName');
            redditName.innerHTML = "r/" + currentSubreddit;

            r = true;

            // Removing Loading icon ---------------------------------------------------
            loadGif.src = '';
            loadGif.style.height = '0px';
            loadGif.style.width = '0px';

        }
        ).catch(error => {
            console.error("nahi chala " + error)

            subreddit =  currentSubreddit;
            i = currenti;
            redditName.innerHTML = "r/" +currentSubreddit;
            loadGif.src = '';
            loadGif.style.height = '0px';
            loadGif.style.width = '0px';
        })

}



getVideo();

//  ------------------------------Mute Button--------------------------------------
let M = false;
// console.log(M);

mut.onclick = () => {
    playPause();
}


function playPause() {

    if (M == false) {
        au.muted = true;
        mut.innerHTML = 'unmute';
        mut.style.backgroundColor = "#6e93c7";
        M = true;
        // console.log(M);

    } else {
        au.muted = false;
        mut.innerHTML = 'mute'
        mut.style.backgroundColor = "";
        M = false;
        // console.log(M);
    }
}




function changeVol(newVal) {
    au.volume = newVal;

}



function clickedNxt() {
    i = i + 1;
    if (i > 101) {
        i = 0;
    }
    getVideo();
}

function clickedBack() {
    i = i - 1;
    if (i < 0) {
        i = 101;
    };
    getVideo();
}

// timeUpdate function is used so that if someone changes /skips video to some other time ,audio should also play from new timestamp .
function timeUpdates(ct) {
    let tv = ct.currentTime;
    let ta = au.currentTime;

    //Here i am using if condition because there will always be some minute delay in audio and video so if i dont use this condition then at every interval it will keep correcting audio time and a glitch sound can be heard at every interval .................................
    if ((tv - ta) > (0.2) || (tv - ta) < (-0.2)) {
        au.currentTime = ct.currentTime;
    }
    // in place of ct.currentTime we can also use vd.currentTime;

}

// Form for Subreddit change-------------------------------------------------------------
var frm = document.getElementById("form");
frm.addEventListener('submit', function (event) {
    event.preventDefault() //prevents from auto submitting
    var inpt = document.getElementById("inpt").value;
    subreddit = String(inpt);
    i = 0;
    getVideo();
})

// Form is for taking input of MemeNo --------------------------------------------------------
var frm2 = document.getElementById("form2");
frm2.addEventListener('submit', function (event) {
    event.preventDefault() //prevents from auto submitting
    var inptNo = document.getElementById("inptNo").value;
    i = parseInt(inptNo);
    getVideo();
})