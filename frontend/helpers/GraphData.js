function transformFB(inputData) {
  let transformedData = {
    fbdata: {
      followers: [],
      likes: [],
      trackingData: [],
    },
  };
  inputData?.fbData?.forEach((item) => {
    transformedData.fbdata.followers.push(item?.followers);
    transformedData.fbdata.likes.push(item?.likes);
    transformedData.fbdata.trackingData.push(item?.trackingData);
  });

  // Padding with zeros if followers or likes contain less than 4 data
  while (transformedData.fbdata.followers.length < 2) {
    transformedData.fbdata.followers.unshift(0);
  }
  while (transformedData.fbdata.likes.length < 2) {
    transformedData.fbdata.likes.unshift(0);
  }
  while (transformedData.fbdata.trackingData.length < 2) {
    transformedData.fbdata.trackingData.unshift(" ");
  }

  return transformedData;
}

function transformYT(data) {
  const youtubedata = {
    views: [],
    likes: [],
    comments: [],
    shares: [],
    subscribersGained: [],
    subscribersLost: [],
    engagementRate: [],
    trackingData: [],
  };

  data.forEach((item) => {
    const { month, views, likes, comments, shares, subscribersGained, subscribersLost, engagementRate } = item;

    // Populate each array with the corresponding data
    youtubedata.views.push(views);
    youtubedata.likes.push(likes);
    youtubedata.comments.push(comments);
    youtubedata.shares.push(shares);
    youtubedata.subscribersGained.push(subscribersGained);
    youtubedata.subscribersLost.push(subscribersLost);
    youtubedata.engagementRate.push(engagementRate);

    // Populate trackingData with the month
    youtubedata.trackingData.push(month.slice(0,3));
  });

  return youtubedata;
}

function transformIG(inputData) {
  let transformedData = {
    instadata: {
      followers: [],
      avgInteractions: [],
      avgER: [],
      avgLikes: [],
      avgComments: [],
      trackingData: [],
    },
  };
  inputData?.instaData?.forEach((item) => {
    transformedData.instadata.followers.push(item?.followers);
    transformedData.instadata.avgComments.push(item?.avgComments);
    transformedData.instadata.trackingData.push(item?.trackingDate);
    transformedData.instadata.avgER.push(item?.avgER*1000);
    transformedData.instadata.avgInteractions.push(item?.avgInteractions);
    transformedData.instadata.avgLikes.push(item?.avgLikes);
  });

  // Padding with zeros if followers or likes contain less than 4 data
  while (transformedData.instadata.followers.length < 2) {
    transformedData.instadata.followers.unshift(0);
  }
  while (transformedData.instadata.avgComments.length < 2) {
    transformedData.instadata.avgComments.unshift(0);
  }
  while (transformedData.instadata.avgER.length < 2) {
    transformedData.instadata.avgER.unshift(" ");
  }
  while (transformedData.instadata.avgInteractions.length < 2) {
    transformedData.instadata.avgInteractions.unshift(0);
  }
  while (transformedData.instadata.avgLikes.length < 2) {
    transformedData.instadata.avgLikes.unshift(0);
  }
  while (transformedData.instadata.trackingData.length < 2) {
    transformedData.instadata.trackingData.unshift(" ");
  }

  return transformedData;
}

function formatNumber(num) {
  let res;
  if (num >= 1000000) {
    res = (num / 1000000).toFixed(1).toString() + "M";
  } else if (num >= 1000) {
    res = (num / 1000).toFixed(1).toString() + "k";
  } else {
    res = num.toString();
  }
  return res;
}

function timeStampFormatter(timestamp){
  var milliSeconds=(new Date() - new Date(timestamp))
  if(milliSeconds>=86400000)
      return `${Math.floor(milliSeconds/(24*60*60*1000))} days ago`
  else if(milliSeconds>=3600000)
      return `${Math.floor(milliSeconds/(60*60*1000))} hour ago`
  else
      return `${Math.floor(milliSeconds/(60*1000))} mins ago`
}


export { transformFB, transformIG, transformYT,formatNumber,timeStampFormatter };
