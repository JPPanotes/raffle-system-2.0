//LUCKY DRAW ANIMATION
document.addEventListener('DOMContentLoaded', function () {
    const winnerLabel = document.getElementById('scroll-label');
    const startButton = document.getElementById('animation-control');
    let employeeNames = [];

    function loadCSV() {
        fetch('employee_data.csv') // Update the path to your CSV file
          .then(response => response.text())
          .then(csvData => {
            // Parse CSV data using Papa Parse
            Papa.parse(csvData, {
                header: true,
                complete: function (results) {
                  // Assuming 'Full Name' is the column you want
                  employeeNames = results.data
                    .map(row => row['Full Name'])
                    .filter(name => name !== null && name !== undefined); // Filter out null values
                }
            });
          })
          .catch(error => console.error('Error loading CSV:', error));
      }


    let isAnimating = false;
    let animationInterval;

    function startAnimation() {
        if (employeeNames.length === 0) {
            // Load CSV data if the employeeNames array is empty
            loadCSV();
            return;
          }
        isAnimating = true;
        startButton.textContent = 'Stop';

        animationInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * employeeNames.length);
            const winner = employeeNames[randomIndex];
            winnerLabel.textContent = winner;
        }, 20); // Change the interval as needed (milliseconds)
    }

    function stopAnimation() {
        if (isAnimating) {
            clearInterval(animationInterval);
            isAnimating = false;
            startButton.textContent = 'Pick Another Winner';

            setTimeout(() => {
                announceWinner(winnerLabel.textContent);
            }, 800);
        }
    }

    function announceWinner(winner) {
        if (!winner) {
            return;
        }


        Swal.fire({
          title: '<pre><img src="congrats_logo.png" width="500" height="300"/></pre>',
            html: `<h1 style="font-size: 50px">The winner is... <br><strong>${winner}</strong></h1>`,
            color: 'black',
            //imageUrl: "https://media.tenor.com/qg8K8VOmzJwAAAAi/party-popper-confetti.gif",
            //imageHeight: 100,
            //width: 620,
            //padding: 30,
            width: 620,
            padding: 30,
            background: '#fff url(https://www.icegif.com/wp-content/uploads/2022/10/icegif-309.gif)',
            confirmButtonText: 'Next Draw',
            confirmButtonColor: '#3498db',
            customClass: {
              title: 'congrats',
            }
        });
    }

    startButton.addEventListener('click', () => {
        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
});