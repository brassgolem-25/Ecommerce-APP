    const logincheck=isUserLogIn;
  function showDropDown(){
      if(logincheck==="false"){
          const element = document.querySelectorAll('.logIn');
          for(var ind=0;ind<element.length;ind++){
            element[ind].remove('.logIn');
          }
      }else {
          const element = document.querySelectorAll('.notLogIn');
          element[0].remove('.notLogIn');
  
      }
  }
