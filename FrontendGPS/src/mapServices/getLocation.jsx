function getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve([position.coords.latitude, position.coords.longitude]),
          () => reject()
        );
      } else {
        reject();
      }
    });
  }
  
  export default getLocation;
  