		const navHamburger = document.querySelector('#navHamburger');
        navHamburger.addEventListener('click', (e) => {
			navHamburger.parentElement.classList.toggle('active');
			const act = document.getElementsByClassName('active');
			const pic = document.getElementById('picture');
			
				if (act.length == 0) {
					pic.src='images/logo.png';
				} 
				else{
					pic.src='images/logo-active.png';
				}
			
		})
		
		
		