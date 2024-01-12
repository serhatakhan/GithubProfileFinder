const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// form submit olduğunda bu fonk çalışacak
form.addEventListener("submit", (e) => {
  // submit olduğunda sayfanın yenilenmesini engelledik
  e.preventDefault();

  // inputa yazdığımız değeri bir değişkene atadık
  const user = search.value;

  // o değişkeni de yukarıdaki fonksiyona parametre olarak verip burada çalıştırdık.
  getUser(user);

  search.value = "";
});

// axios kullanımı / zaman alan bir işlem olduğu için async await kullandık.
async function getUser(userName) {
  try {
    const { data } = await axios(API_URL + userName);
    //   console.log(data)

    // dinamik kartların fonsiyonu. burada çağırdık.
    createUserCard(data);

    // repo'ları getirmek için bu fonk'u tanımladık ve burada çağırdık. aranan ismi parametre olarak ver
    getRepos(userName)

  } catch (error) {
    // console.log(error);
    createErrorCard("Oppsss.. User Not Found :(");
    // kimseyi bulamazsa bu fonksiyon çalışsın
  }
}

function createUserCard(user) {
  /* kullanıcıların hepsinin usernamesi olmayabilir veya bio'su olmayabilir,
    ondan dolayı varsa böyle yap yoksa şöyle yap şeklinde koşullar yazdık. */
  const userName = user.name || user.login;
  const userBio = user.bio ? `<p> ${user.bio} </p>` : "";

  //   bu oluşturduğumuz elemanı dinamik yapıp main'in içine atacağız.
  const cardHTML = `
    <div class="card">
    <img
      class="user-image"
      src=${user.avatar_url}
      alt="user image"
    />

    <div class="user-info">
      <div class="user-name">
        <h2>${userName}</h2>
        <small>@${user.login}</small>
      </div>
    </div>

    <p>
      ${userBio}
    </p>

    <ul>
      <li>
        <i class="fa-solid fa-users"></i><strong> ${user.followers} Followers</strong>
      </li>
      <li>
        <i class="fa-solid fa-user"></i><strong> ${user.following} Following</strong>
      </li>
      <li>
        <i class="fa-solid fa-book"></i><strong> ${user.public_repos} Repository</strong>
      </li>
    </ul>

    <div class="repos" id="repos">
      
    </div>
  </div>
    `;

  main.innerHTML = cardHTML;
}

// kullanıcı bulunamadığında catch içerisinde çalışacak fonk.
function createErrorCard(message) {
  // main'in içindeki div'in içine yerleşsin istediğimiz için class'ını yukarıdaki div gibi card yaptık
  const cardErrorHTML = `
    <div class="card">
        <h2>${message}</h2>
    </div>
    `;

  main.innerHTML = cardErrorHTML;
}

// 
async function getRepos(username){
    try {
        // repolara ulaştık
        const {data} = await axios(API_URL + username + "/repos") 
        // console.log(data)

        addReposToCard(data)

    } catch (err) {
        createErrorCard("Repositories Not Found :(")
    }
}
// card'lardaki repo kısmını dinamik şekilde oluşturduğumuz fonk.
function addReposToCard(repos){
    const reposEl = document.getElementById("repos")
    
    // gelen datayı repos parametre ismiyle almıştık. bu repos'u dönmemiz gerek.
    /* 3 tane repo alsın istedik ve ben 9 ile 13 arasını istediğim için,
    slice(9,13) --> 9'dan 13'e şeklinde yazdım.*/
    repos.slice(9,13).forEach((repo)=>{
        const reposLink = document.createElement("a")
        reposLink.href = repo.html_url
        reposLink.target ="_blank"
        reposLink.innerHTML=`<i class="fa-solid fa-book"></i> ${repo.name}`
        // en son da repos id'li div'in içine ekledik
        reposEl.appendChild(reposLink)
    })
}
