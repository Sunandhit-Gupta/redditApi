
let i = 0;
// K variabe is made so that the sharedPostId condition to search from url ,works only once and donot work after clicking next button again ------------
let k = 0;
let currenti = 0;
let currentSubreddit = 'india'
let subreddit = 'india';
var sharedPostId;
var postId;
var video;
var ytUsed = false;

// Variable r is used to detect whether the image content is loading for the first time or it has alread loaded once .If it is already loaded once then we use 'replaceChild' rather than 'appendChild';

let r = false;
// -----------------------------------------------------------------------------------------------
// Getting URL details  in javascript :-----------------------------------------------------------
getUrlParams();

function getUrlParams() {
    const keys = window.location.search;
    const parameters = new URLSearchParams(keys);

    const reddit = parameters.get('reddit');
    const no = parameters.get('no');

    // Adding sharedPostId and searching of same id to find the updated index of the same post which was shared hours ago ------------------>
    sharedPostId = parameters.get('id');
    console.log(reddit);
    console.log(no);

    if (reddit != null) {
        subreddit = reddit;
    };

    if (no != null && sharedPostId == null) {
        i = parseInt(no);
    };
    getVideo();
}


// ---------------------------------------------------------------------------------------

function getVideo() {
    apiUrl = `https://www.reddit.com/r/${subreddit}.json?limit=100`;

    // Adding Loading icon before using Fetch call----------------------------------------
    loadGif = document.getElementById('loadingGif');
    loadGif.src = 'loadingIcon.gif';
    loadGif.style.height = '15px';
    loadGif.style.width = '15px';

    fetch(apiUrl, { method: 'GET' }).then(response => response.json()).
        then(response => {
            // K value is used to ensure that this "if" statement works only once .
            if (sharedPostId != null && k == 0) {
                indexId = response.data.children.findIndex(z => z.data.id === sharedPostId);
                i = indexId;
                k++;
            }
            // Changing the URL query to empty so that the URL looks clean :--------------->
            window.history.pushState({}, '', window.location.pathname);
            isOriginalContent = '';

            // getting info whether content is shared from some other subreddit or original------->
            checkCrossPost = response.data.children[i].data.crosspost_parent_list;

            is_gallery = response.data.children[i].data.is_gallery;
            console.log(is_gallery);
           
                domain = response.data.children[i].data.domain;
                console.log(domain);
            
            if (checkCrossPost == undefined) {
                isOriginalContent = true;
            } else {
                isOriginalContent = false;
            }
            // --------       --Getting info about the type o content -------------------------->
            contentTypeVideo = response.data.children[i].data.is_video;
            // -----------------------------------------------------------------------------------------------------------
            if (isOriginalContent == false) {

                isOriginalContentVideo = response.data.children[i].data.crosspost_parent_list[0].is_video;
                if (isOriginalContentVideo == true) {
                    video = response.data.children[i].data.crosspost_parent_list[0].media.reddit_video.fallback_url;
                    contentTypeVideo = true;
                } else {
                    imgUrl = response.data.children[i].data.crosspost_parent_list[0].url;
                    contentTypeVideo = false;
                }
            }
            // ------------------------------------------------------------------------------------------------------
            if (contentTypeVideo == true) {

                if (ytUsed == true) {
                    playerDiv = document.getElementById('player');
                    playerDiv.innerHTML = ' <!-- video added -->  <video controls ontimeupdate="timeUpdates(this)" id="ck" class="ck" preload="auto" loop>   <source id="jp" type="video/mp4" src=""></video>    <!-- audio added in video format -->  <video height="0" , width="0" controls id="au" class="au" preload="auto" loop>    <source id="ausrc" type="video/mp4" src=""></video>'
                }

                if (isOriginalContent == true) {
                    video = response.data.children[i].data.media.reddit_video.fallback_url;
                };

                let originalPostvid = response.data.children[i].data.permalink;
                postId = response.data.children[i].data.id;


                audio = video.slice(0, 37) + "audio.mp4";

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
                vidLikeHref.href = "https://www.reddit.com/" + originalPostvid;


                // Adding memeNo buttons ------>
                memeElement = document.getElementById('memeNo');
                memeElement.innerHTML = 'memeNo: ' + i;


                // Changing CurrentSubreddit if subreddit is changed in this request after showing video------------
                currentSubreddit = subreddit;
                currenti = i;
                redditName = document.getElementById('redditName');
                redditName.innerHTML = "r/" + currentSubreddit;

                // making ytUsed variabe false:--------
                ytUsed = false;

            }
            else if (domain == "youtube.com"|| domain ==  "youtu.be"){
                ytLink = response.data.children[i].data.url;

                // made ytLinkInitials to check whether youtube Url has www. in starting or not ------
                ytLinkInitials = ytLink.slice(8,16);
        
                if(domain == "youtube.com"){
                    if(ytLinkInitials == "www.yout"){
                ytVideoId = ytLink.slice(32, 43);}
                else if(ytLinkInitials == "youtube."){
                    ytVideoId = ytLink.slice(28,39);
                }
            }

                else if(domain=="youtu.be"){
                    ytVideoId = ytLink.slice(17, 29);
                }

                let originalPostvid = response.data.children[i].data.permalink;
                postId = response.data.children[i].data.id;


                playerDiv = document.getElementById('player');
                playerDiv.innerHTML = `<iframe class ="ytPlayer" id ="ytPlayer" src="https://www.youtube.com/embed/${ytVideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`


                // Removing Loading Icon after loading Video----------------------------------
                loadGif.src = '';
                loadGif.style.height = '0px';
                loadGif.style.width = '0px';

                // Linking AudioPlayback with Video---------------------------------

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
                vidLikeHref.href = "https://www.reddit.com/" + originalPostvid;


                // Adding memeNo buttons ------>
                memeElement = document.getElementById('memeNo');
                memeElement.innerHTML = 'memeNo: ' + i;


                // Changing CurrentSubreddit if subreddit is changed in this request after showing video------------
                currentSubreddit = subreddit;
                currenti = i;
                redditName = document.getElementById('redditName');
                redditName.innerHTML = "r/" + currentSubreddit;

                // making ytUsed variable True:---
                ytUsed = true;

            }


            else if (contentTypeVideo == false && is_gallery == undefined) {

                if (isOriginalContent == true) {
                    imgUrl = response.data.children[i].data.url;
                    
                };
                let originalPostimg = response.data.children[i].data.permalink;
                postId = response.data.children[i].data.id;

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
                imgLikeHref.href = "https://www.reddit.com/" + originalPostimg;



                // Adding memeNo buttons ------>
                memeElement = document.getElementById('memeNo');
                memeElement.innerHTML = 'memeNo: ' + i;


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
            else if (is_gallery == true) {

                galleryPermalink = response.data.children[i].data.permalink;
                let originalPostimg = response.data.children[i].data.permalink;
                postId = response.data.children[i].data.id;

                // Making html to show Images,Likes, Author and Title-------------------------------------------------------------------------------
                imageDiv = document.getElementById('imageDiv');

                imageDiv.innerHTML = `<h5 class ='imgHr'>Images will be shown Here</h5><hr>
                <iframe id='reddit-embed' class = 'reddit-embed'src='https://www.redditmedia.com${galleryPermalink}?ref_source=embed&amp;ref=share&amp;embed=true' sandbox='allow-scripts allow-same-origin allow-popups' style='border: none;' height='300' width='640' scrolling='no'></iframe><div class='imgAaT' id='imgAaT'><span class='imgAuthor' id='imgAuthor'></span><span class='imgTitle' id='imgTitle'></span></div><div class='imgBtns'><a href='' id='imgLikeHref' class='imgLikeHref' target='_blank'><button class='imgLike' id='imgLike'></button></a></div>`

                // imge = document.getElementById('imge');
                // imge.src = imgUrl;

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
                imgLikeHref.href = "https://www.reddit.com/" + originalPostimg;



                // Adding memeNo buttons ------>
                memeElement = document.getElementById('memeNo');
                memeElement.innerHTML = 'memeNo: ' + i;


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


        }
        ).catch(err => {
            console.error(err);
            alert('Subreddit Not Found or Some Other Error')
            subreddit = currentSubreddit;
            i = currenti;
            redditName.innerHTML = "r/" + currentSubreddit;
            loadGif.src = '';
            loadGif.style.height = '0px';
            loadGif.style.width = '0px';
        })

}

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

// Adding Next button scipt----------------------------->

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
    if ((tv - ta) > (0.4) || (tv - ta) < (-0.4)) {
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
    frm.reset();
    getVideo();
})

// Form is for taking input of MemeNo --------------------------------------------------------
var frm2 = document.getElementById("form2");
frm2.addEventListener('submit', function (event) {
    event.preventDefault() //prevents from auto submitting
    inptNo = document.getElementById("inptNo").value;
    i = parseInt(inptNo);
    frm2.reset();
    getVideo();
})


function shareIt() {
    originUrl = window.location.origin;
    sitePathUrl = window.location.pathname;
    window.prompt(`Copy and Share this Url with Others :`, `${originUrl}` + `${sitePathUrl}` + `?reddit=${currentSubreddit}&id=${postId}`);
}