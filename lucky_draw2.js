var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


$(document).ready(function () {
    adjustFontSize();

    // Adjust font size on window resize
    $(window).on('resize', function () {
        adjustFontSize();
    });

    function adjustFontSize() {
        var label = $('#scroll-label');
        var container = $('.container');

        // Reset font size
        label.css('font-size', '');

        // Check if the label overflows the container
        if (label[0].scrollWidth > container.width()) {
            // Reduce font size to fit the text
            var fontSize = parseInt(label.css('font-size'));
            label.css('font-size', fontSize - 1 + 'px');
        }
    }
});

window.addEventListener('beforeunload', function (event) {
    // Customize the confirmation message
    const confirmationMessage = "Are you sure you want to leave? The raffle system will stop if you refresh or close the page.";

    // Conditionally show the "Reload" option based on your preference
    event.returnValue = confirmationMessage; // Standard for most browsers

    // Uncomment the line below if you want to show the "Reload" option for some browsers
    // return confirmationMessage; // For some older browsers

    // Returning nothing (or returning undefined) usually prevents the "Reload" option in modern browsers
    // return undefined; 
});

// Optionally, you can also prevent page navigation via the keyboard shortcut
window.addEventListener('keydown', function (event) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault(); // Cancel the refresh
    }
});

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

//LUCKY DRAW ANIMATION
document.addEventListener('DOMContentLoaded', function () {
    const winnerLabel = document.getElementById('scroll-label');
    const startButton = document.getElementById('animation-control');
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const customSelectDiv = document.querySelector('.custom-select');
    const raffleLogo = document.getElementById('raffle_logo');
    let employeeNames = [];
    let allEmployeeData = []; // Add this variable
    const alreadySelectedWinners = [];

    function loadCSV() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        fileInput.style.display = 'none';
        fileLabel.style.display = 'none';
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;
            Papa.parse(csvData, {
                header: true,
                complete: function (results) {
                    employeeNames = results.data
                        .map(row => row['Employee Name'])
                        .filter(name => name !== null && name !== undefined && name.trim() !== '');
    
// Save all CSV data
allEmployeeData = results.data;
    
// Sort the CSV data based on Employee Number
allEmployeeData.sort((a, b) => {
    const empNumberA = parseInt(a['Employee Number'].replace(/\D/g, ''), 10);
    const empNumberB = parseInt(b['Employee Number'].replace(/\D/g, ''), 10);
    return empNumberA - empNumberB;
});
}
});
};

reader.readAsText(file);

}

fileInput.addEventListener('change', loadCSV);


let isAnimating = false;
let animationInterval;
let slowdownInterval1;
let slowdownInterval2;
let prizeCount = 1; // Variable to track the prize count (starts at 1)
function startLuckyDraw(employeeType) {
    if (employeeNames.length === 0) {
        // Load CSV data if the employeeNames array is empty
        loadCSV();
        return;
    }   
    cleanupBeforeNewDraw()
    raffleLogo.style.display = 'inline-block';
    // Filter employees based on type
if (employeeType === 'JOCOS') {
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return (
                (empNumber.startsWith('JO-') || empNumber.startsWith('Jo-') || 
                 empNumber.startsWith('CS-') || empNumber.startsWith('Cs-') ||
                 empNumber.startsWith('COS-') || empNumber.startsWith('Cos-')) &&
                !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-'))  // Exclude PA/Pa
                
            );
        })
        .map(row => row['Employee Name']);
} else if (employeeType === 'organic') {
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return (
                !empNumber.startsWith('JO-') && !empNumber.startsWith('Jo-') && 
                !empNumber.startsWith('CS-') && !empNumber.startsWith('Cs-') &&
                !empNumber.startsWith('COS-') && !empNumber.startsWith('Cos-') &&
                !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-') // Exclude PA/Pa

            ));
        })
        .map(row => row['Employee Name']);
} else {
    // Exclude PA/Pa for "All" selection
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-'));
        })
        .map(row => row['Employee Name']);
}
    
    isAnimating = true;
    startButton.textContent = 'Stop';

    let startTime = Date.now();

    animationInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        startButton.style.display = 'none';
        fileInput.style.display = 'none';
        fileLabel.style.display = 'none';
        employeeTypeSelector.style.display = 'none';
        customSelectDiv.style.display = 'none';
        numberOfWinnersSelector.parentElement.style.display = 'none';
        

        if (elapsedTime < 6000) {
            // Normal speed animation
            animate();
        } else if (elapsedTime < 7500) {
            // First slowdown interval
            if (!slowdownInterval1) {
                clearInterval(slowdownInterval2); // Clear the second slowdown interval if it exists
                slowdownInterval1 = setInterval(() => {
                    animate();
                }, 100); // Adjust the first slowdown interval as needed (milliseconds)
            }
        } else {
            // Second slowdown interval
            if (!slowdownInterval2) {
                clearInterval(slowdownInterval1); // Clear the first slowdown interval if it exists
                slowdownInterval2 = setInterval(() => {
                    animate();
                }, 300); // Adjust the second slowdown interval as needed (milliseconds)
            }
        }

        if (elapsedTime >= 10000) {
            stopAnimation();
            
        }
    }, 20); // Change the interval as needed (milliseconds)

    // Automatically stop the animation after 10 seconds
    setTimeout(() => {
        stopAnimation();
    }, 10000); // 10 seconds in milliseconds
}

function animate() {
    let randomIndex;
    let winner;
    do {
        randomIndex = Math.floor(Math.random() * employeeNames.length);
        winner = employeeNames[randomIndex];
    } while (alreadySelectedWinners.includes(winner));

    winnerLabel.textContent = winner;
}


//////////////////////////////TEN WINNERS RAFFLE DRAW//////////////////////////
function setSlotSize(winnerContainer, numberOfWinners) {
    const slots = winnerContainer.children;

    // Adjust sizes based on the number of winners
    let slotSize, fontSize;
    if (numberOfWinners === 2) {
        slotSize = { width: '700px', height: '200px' };
        fontSize = '42px';
    } else if (numberOfWinners === 3) {
        slotSize = { width: '500px', height: '200px' };
        fontSize = '36px';
    } else if (numberOfWinners === 4) {
        slotSize = { width: '450px', height: '200px' };
        fontSize = '30px';
    } else if (numberOfWinners === 5) {
        slotSize = { width: '320px', height: '200px' };
        fontSize = '30px';
    } else if (numberOfWinners === 10) {
        slotSize = { width: '300px', height: '150px' };
        fontSize = '26px';
    }

    // Apply styles to each slot
    Array.from(slots).forEach(slot => {
        slot.style.width = slotSize.width;
        slot.style.height = slotSize.height;
        slot.querySelector('.slot-text').style.fontSize = fontSize;
    });
}

function cleanupBeforeNewDraw() {
    const container = document.querySelector('.container');
    
    // Clear the previous title, prize label, winner container, and any other dynamic elements
    const titleElement = document.querySelector('.raffle-title');
    const prizeLabel = document.querySelector('.prize-label');
    const winnerContainer = document.querySelector('.winner-container');
    
    if (titleElement) titleElement.remove();
    if (prizeLabel) prizeLabel.remove();
    if (winnerContainer) winnerContainer.remove();

    // Reset any other dynamic content if necessary, e.g., winner label
    winnerLabel.textContent = '';  // Assuming you have a label showing the winner
}

function startRaffleWithMultipleWinners(employeeType, numberOfWinners) {
    if (employeeNames.length === 0) {
        loadCSV(); // Load employee data if not already loaded
        return;
    }
    cleanupBeforeNewDraw();

    const container = document.querySelector('.container');
    startButton.style.display = 'none';
    fileInput.style.display = 'none';
    fileLabel.style.display = 'none';
    employeeTypeSelector.style.display = 'none';
    customSelectDiv.style.display = 'none';
    numberOfWinnersSelector.parentElement.style.display = 'none';
    raffleLogo.style.display = 'none';

    const titleElement = document.createElement('h2');
    titleElement.className = 'raffle-title';
    titleElement.textContent = 'Get Ready for the Draw!';
    container.appendChild(titleElement);

    // Create an editable text label for the prize
    const prizeLabel = document.createElement('div');
    prizeLabel.className = 'prize-label';
    prizeLabel.contentEditable = 'true';
    prizeLabel.textContent = 'Prize';
    container.appendChild(prizeLabel);

    const winnerContainer = document.createElement('div');
    winnerContainer.className = 'winner-container';

    // Dynamically adjust grid layout based on number of winners
    if (numberOfWinners === 2) {
        winnerContainer.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Center 2 winners
    } else if (numberOfWinners === 3) {
        winnerContainer.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Center 3 winners
    } else if (numberOfWinners === 4) {
        winnerContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 2 columns for 2 rows
        
    } else if (numberOfWinners === 5 || numberOfWinners === 10) {
        winnerContainer.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Default to 5 per row
    }

    for (let i = 1; i <= numberOfWinners; i++) {
        const winnerSlot = document.createElement('div');
        winnerSlot.className = 'winner-slot pre-animation';
        winnerSlot.innerHTML = `<div class="slot-number">${i}</div><div class="slot-text">Winner</div>`;
        winnerContainer.appendChild(winnerSlot);
    }

    container.appendChild(winnerContainer);
    
    // Adjust the size of the slots based on the number of winners
    setSlotSize(winnerContainer, numberOfWinners);

    container.appendChild(winnerContainer);

    // Animate slots before the draw starts
    function animateSlots() {
        return new Promise(resolve => {
            const slots = winnerContainer.children;
            Array.from(slots).forEach((slot, index) => {
                setTimeout(() => {
                    slot.classList.remove('pre-animation');
                    slot.classList.add('animate-in');
                }, index * 200);
            });

            setTimeout(resolve, slots.length * 200 + 500);
        });
    }

// Filter employees based on type
if (employeeType === 'JOCOS') {
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return (
                (empNumber.startsWith('JO-') || empNumber.startsWith('Jo-') || 
                 empNumber.startsWith('CS-') || empNumber.startsWith('Cs-') ||
                 empNumber.startsWith('COS-') || empNumber.startsWith('Cos-')) &&
                !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-')) // Exclude PA/Pa
            );
        })
        .map(row => row['Employee Name']);
} else if (employeeType === 'organic') {
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return (
                !empNumber.startsWith('JO-') && !empNumber.startsWith('Jo-') && 
                !empNumber.startsWith('CS-') && !empNumber.startsWith('Cs-') &&
                !empNumber.startsWith('COS-') && !empNumber.startsWith('Cos-') &&
                !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-') // Exclude PA/Pa
            ));
        })
        .map(row => row['Employee Name']);
} else {
    // Exclude PA/Pa for "All" selection
    employeeNames = allEmployeeData
        .filter(row => {
            const empNumber = row['Employee Number'];
            return !(empNumber.startsWith('PA-') || empNumber.startsWith('Pa-'));
        })
        .map(row => row['Employee Name']);
}


// Step 2: Select winners and keep "?????" placeholders
const winnerSlots = [...winnerContainer.children];
const selectedWinners = [];

async function selectWinners() {
    for (let i = 0; i < numberOfWinners; i++) {
        const currentSlot = winnerSlots[i].querySelector('.slot-text');

        // Animate with random names
        await new Promise(resolve => {
            let animationInterval = setInterval(() => {
                let randomIndex;
                let randomName;
                do {
                    randomIndex = Math.floor(Math.random() * employeeNames.length);
                    randomName = employeeNames[randomIndex];
                } while (alreadySelectedWinners.includes(randomName));

                currentSlot.textContent = randomName;
            }, 50);

            setTimeout(() => {
                clearInterval(animationInterval);

                // Display "?????" and finalize winner
                currentSlot.textContent = '?????';
                let randomIndex;
                let winner;
                do {
                    randomIndex = Math.floor(Math.random() * employeeNames.length);
                    winner = employeeNames[randomIndex];
                } while (alreadySelectedWinners.includes(winner));

                selectedWinners.push(winner);
                alreadySelectedWinners.push(winner); // Add to the already selected list
                employeeNames.splice(randomIndex, 1); // Remove from employee list
                resolve();
            }, 2000);
        });
    }
}


// Function to create and download the Excel file
// Function to create and download the Excel file
function createExcelFile(winners, prizeName) {
const wb = XLSX.utils.book_new(); // Create a new workbook

// Format the winners data
const winnersData = winners.map((winner, index) => {
    return {
        Rank: index + 1,
        Winner: winner
    };
});

// Create a new worksheet
const ws = XLSX.utils.json_to_sheet(winnersData);

// Add the sheet to the workbook
const sheetName = prizeName || 'Sheet#'; // Use prize name as the sheet name, default to 'Sheet#'
XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate the Excel file name with prize name included (sanitize it for file name)
    const sanitizedPrizeName = prizeName ? prizeName.replace(/[\/\\?%*:|"<>]/g, '_') : 'Raffle';  // Replace invalid characters
        const fileName = `Raffle_Winners_${sanitizedPrizeName}.xlsx`;  // Use prize name in the file name

    // Generate the Excel file and trigger download with the dynamic file name
    XLSX.writeFile(wb, fileName);
}

    // Step 3: Reveal winners with animation
    // Modified revealWinners function with Excel creation
    async function revealWinners() {
        const revealDelay = 500; // Delay between each winner reveal in ms
        const bufferTime = 1000; // Extra buffer time after all winners are revealed
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Initial delay before reveal
    
        winnerSlots.forEach((slot, index) => {
            const slotText = slot.querySelector('.slot-text');
            setTimeout(() => {
                slot.classList.add('reveal-animation');
                slotText.textContent = selectedWinners[index];
            }, index * revealDelay); // Delay for each winner based on their index
        });
    
        // Calculate total delay: (number of winners * revealDelay) + bufferTime
        const totalDelay = numberOfWinners * revealDelay + bufferTime;
        
        setTimeout(() => {
            titleElement.textContent = 'Congratulations to All Winners!';
    
            // Create a container for the two dropdowns
            const dropdownsContainer = document.createElement('div');
            dropdownsContainer.style.display = 'flex';
            dropdownsContainer.style.alignItems = 'center';  // Vertically align items
            dropdownsContainer.style.gap = '10px';  // Optional: Add space between elements
        
            // Append the two dropdowns to the container
            dropdownsContainer.appendChild(customSelectDiv);
            dropdownsContainer.appendChild(numberOfWinnersSelector.parentElement);
        
            // Move the button and the dropdowns container to the bottom
            container.appendChild(startButton);  // Move the button to the bottom
            container.appendChild(dropdownsContainer);  // Move the dropdown container to the bottom
        
            // Re-enable the button and dropdowns
            startButton.textContent = 'Pick Another Winner';
            startButton.style.display = 'inline-block';
            dropdownsContainer.style.display = 'flex';
            customSelectDiv.style.display = 'inline-block';
            numberOfWinnersSelector.parentElement.style.display = 'inline-block';
    
            // After the draw ends, create and download the Excel file with winners
            const prizeName = prizeLabel.textContent.trim(); // Get the prize name
            createExcelFile(selectedWinners, prizeName);  // Create Excel with the winners and prize name
        }, totalDelay);
    }
    
        // Function to update the title dynamically
        function updateTitle(text) {
            titleElement.textContent = text;
        }
        
    
        // Run the animations and processes
        animateSlots()
            .then(() => {
                updateTitle('The Draw Has Begun!');
                return selectWinners();
            })
            .then(revealWinners);
    }
    
    
    ///////////////////////////TEN WINNERS RAFFLE DRAW/////////////////////////////////

    function stopAnimation() {
        if (isAnimating) {
            clearInterval(animationInterval);
            clearInterval(slowdownInterval1);
            clearInterval(slowdownInterval2);
            slowdownInterval1 = null;
            slowdownInterval2 = null;
            isAnimating = false;
            startButton.textContent = 'Pick Another Winner';
            setTimeout(() => {
                const finalWinner = winnerLabel.textContent;
                alreadySelectedWinners.push(finalWinner); // Add to the already selected list
                const winnerIndex = allEmployeeData.findIndex(row => row['Employee Name'] === finalWinner);
                if (winnerIndex !== -1) {
                    allEmployeeData.splice(winnerIndex, 1); // Remove from main employee data
                }
                announceWinner(finalWinner);
            }, 800);
            startButton.style.display = 'inline-block';
            customSelectDiv.style.display = 'inline-block';
            numberOfWinnersSelector.parentElement.style.display = 'inline-block';
        }
    }
    
    function announceWinner(winner) {
        if (!winner) {
            return;
        }
        // Remove the winner from allEmployeeData permanently
        const winnerIndex = allEmployeeData.findIndex(row => row['Employee Name'] === winnerLabel.textContent);
        if (winnerIndex !== -1) {
            allEmployeeData.splice(winnerIndex, 1);
        }
    
        Swal.fire({
            title: '<pre><img src="congrats_logo3.jpg" width="550" height="250"/></pre><br><br>',
            html: `<h2 style="font-size: 40px">The winner is... <br></h2>` +
                  `<h1 style="font-size: 70px"<strong>${winner}</strong></h1>`,
            color: 'black',
            width: 850,
            padding: 50,
            background: '#fff url(https://i.gifer.com/6ob.gif)',
            confirmButtonText: 'Next Draw',
            confirmButtonColor: '#3498db',
            customClass: {
                title: 'congrats',
            }
        });
            // Create the Excel file after the winner is announced
        createExcelFile([winner], `Prize${prizeCount}`);
        prizeCount++; // Increment the prize number for the next raffle
        }
        function createExcelFile(winners, prizeName) {
            const wb = XLSX.utils.book_new(); // Create a new workbook
        
            // Format the winners data
            const winnersData = winners.map((winner, index) => ({
                Rank: index + 1,
                Winner: winner
            }));
        
            // Create a new worksheet
            const ws = XLSX.utils.json_to_sheet(winnersData);
        
            // Add the sheet to the workbook
            const sheetName = `Raffle_1Winner_${prizeName}`; // Use prize name as the sheet name
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
            // Generate the Excel file and trigger download
            const fileName = `Raffle_1Winner_${prizeName}.xlsx`; // Name the file with the prize number
            XLSX.writeFile(wb, fileName);
        }
        
        startButton.addEventListener('click', () => {
            const employeeTypeSelector = document.getElementById('employeeTypeSelector');
            const selectedEmployeeType = employeeTypeSelector.value;
            const numberOfWinnersSelector = document.getElementById('numberOfWinnersSelector');
            const selectedNumberOfWinners = parseInt(numberOfWinnersSelector.value, 10);
        
            if (!selectedEmployeeType) {
                alert('Please select an employee type.');
                return;
            }
        
            if (!selectedNumberOfWinners) {
                alert('Please select the number of winners.');
                return;
            }
        
            // Conditional check for number of winners
            if (selectedNumberOfWinners === 1) {
                // Run the single-winner animation
                startLuckyDraw(selectedEmployeeType);
            } else {
                // Run the multiple-winners animation
                startRaffleWithMultipleWinners(selectedEmployeeType, selectedNumberOfWinners);
            }
        });
        
    });
