// 1. local storage se users or votes ko initialize karwana hai
// 2. sidebar me user list update karna hoga
// 3. each user k liye ek list banao
// 4. username display karo sidebar list me
// 5. username k bagal me delete button dalo
// 6. delete button ko active karo
// 7. click karne pe votes ka popup banao
// 8.  delete button ko sync me delete karo
// 9. filter fir update karo
//10. logout
// 11. sidebar update
// 12. vote count
//13register

document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || []; // user list ko load karte hain localstorage se
    let votes = JSON.parse(localStorage.getItem("votes")) || {}; // empty object number k liye
    let currentUser = JSON.parse(localStorage.getItem("currentUser")); // jo login hai uska user
  
    const updateSidebar = () => {
      const sidebar = document.getElementById("user-list"); // user list ko show karne ke liye sidebar
      sidebar.innerHTML = ""; // list clear kar rahe hain
      users.forEach((user) => {
        const userItem = document.createElement("li"); // har ek user ke liye ek list item
        userItem.classList.add("user-item");
        const userName = document.createElement("span"); // user ke naam ko display karne ke liye span
        userName.textContent = user.email;
        userName.style.marginRight = "10px";
        userItem.appendChild(userName); // span -> mini header
  
        const deleteButton = document.createElement("button"); // delete button banate hain
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "10px";
        deleteButton.style.color = "red";
        deleteButton.style.border = "1px solid black";
        deleteButton.style.padding = "5px 5px";
        deleteButton.style.cursor = "pointer";
  
        deleteButton.addEventListener("click", () => {
          deleteUser(user.email); // error throw kar sakta hai
        });
        userItem.appendChild(deleteButton);
        userItem.addEventListener("click", (event) => {
          if (event.target === deleteButton) return; // delete button pe click na ho
          const userVotes = votes[user.email] || { Tea: 0, Coffee: 0 };
          alert(
            `${user.email}'s votes: \nTea: ${userVotes["Tea"]}\nCoffee :${userVotes["Coffee"]} `
          );
        });
        sidebar.appendChild(userItem); // sidebar me user list dikhate hain
      });
    };
  
    const deleteUser = (email) => {
      users = users.filter((user) => user.email !== email); // user ko filter karte hain
      localStorage.setItem("users", JSON.stringify(users)); // list updated
      delete votes[email]; // votes se bhi delete karna hoga
      localStorage.setItem("votes", JSON.stringify(votes));
  
      if (currentUser && currentUser.email === email) {
        logout();
        alert("Account Deleted! Register again");
      }
      updateSidebar(); // sidebar ko refresh karte hain
    };
  
    const updateVoteDisplay = () => {
      if (currentUser) {
        const userVotes = votes[currentUser.email] || { Tea: 0, Coffee: 0 }; // user ke votes
        document.getElementById("option1-count").textContent = userVotes["Tea"];
        document.getElementById("option2-count").textContent = userVotes["Coffee"];
      }
    };
  
    const register = (email, password) => {
      if (users.some((user) => user.email === email)) {
        alert("User already Registered!"); // duplicate user ke liye error
        return;
      }
  
      users.push({ email, password }); // new user
      localStorage.setItem("users", JSON.stringify(users)); // localstorage me string bhej diya user ka
      alert("User registered!");
      updateSidebar(); // list ko update karte hain
    };
  
    const login = (email, password) => {
      const user = users.find(
        (user) => user.email === email && user.password === password
      ); // user search karte hain
      if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // current user ko save karte hain
        alert("Logged in !!!");
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("vote-section").style.display = "block";
        updateVoteDisplay();
      } else {
        alert("invalid");
      }
    };
  
    const logout = () => {
      currentUser = null;
      localStorage.removeItem("currentUser"); // user ko logout karte hain
      document.getElementById("auth-section").style.display = "block";
      document.getElementById("vote-section").style.display = "none";
    };
  
    const vote = (option) => {
      if (!currentUser) {
        alert("Pehle login karo!"); // login check
        return;
      }
      votes[currentUser.email] = votes[currentUser.email] || {
        Tea: 0,
        Coffee: 0,
      };
      votes[currentUser.email][option] += 1; // destructive property
      localStorage.setItem("votes", JSON.stringify(votes)); // localstorage update
      updateVoteDisplay(); // UI ko update karte hain
    };
  
    // register button event listener
    document.getElementById("register-btn").addEventListener("click", () => {
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      register(email, password);
    });
  
    // login button event listener
    document.getElementById("login-btn").addEventListener("click", () => {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      login(email, password);
    });
  
    document.getElementById("logout-btn").addEventListener("click", logout);
  
    // tea vote button
    document
      .getElementById("vote-option1")
      .addEventListener("click", () => vote("Tea"));
    
    // coffee vote button
    document
      .getElementById("vote-option2")
      .addEventListener("click", () => vote("Coffee"));
  
    updateSidebar(); // initial sidebar update
  
    if (currentUser) {
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("vote-section").style.display = "block";
      updateVoteDisplay(); // agar login hai toh display update
    }
  });