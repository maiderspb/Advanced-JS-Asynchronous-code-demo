//RESUELVE TUS EJERCICIOS AQUI

async function getAllBreeds() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    const breeds = Object.keys(data.message);
    return breeds;
  } catch (error) {
    console.error("Error al obtener las razas", error);
    return [];
  }
}

async function getRandomDog(breed) {
  const fallbackUrl = "https://dog.ceo/api/breeds/image/random";

  try {
    const url = `https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && data.message.includes(".jpg")) {
      return data.message;
    }

    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackData = await fallbackResponse.json();
    return fallbackData.message;
  } catch (error) {
    console.error("Error:", error.message);

    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackData = await fallbackResponse.json();
    return fallbackData.message;
  }
}

async function getAllImagesByBreed(breed) {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/images`;
    const response = await fetch(url);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    return [];
  }
}

async function getAllImagesByBreed2(breed) {
  const url = `https://dog.ceo/api/breed/${breed.toLowerCase()}/images`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && Array.isArray(data.message)) {
      return data.message;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener las imágenes:", error.message);
    return [];
  }
}

async function getGitHubUserProfile(username) {
  const url = `https://api.github.com/users/${username}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el perfil de GitHub:", error.message);
    return null;
  }
}

async function printGithubUserProfile(username) {
  const url = `https://api.github.com/users/${username}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    const userProfile = {
      img: data.avatar_url,
      name: data.name || username,
    };

    const container = document.getElementById("profile-container");
    if (container) {
      const imgElement = document.createElement("img");
      imgElement.src = userProfile.img;
      imgElement.alt = `${userProfile.name}'s avatar`;
      imgElement.style.width = "150px";

      const nameElement = document.createElement("p");
      nameElement.textContent = userProfile.name;

      container.innerHTML = "";
      container.appendChild(imgElement);
      container.appendChild(nameElement);
    } else {
      console.error("No se encontró el contenedor con id 'profile-container'");
    }

    return userProfile;
  } catch (error) {
    console.error(`Error fetching GitHub user profile: ${error.message}`);
    return null;
  }
}

printGithubUserProfile("octocat").then((profile) => {
  if (profile) {
    console.log(profile);
  } else {
    console.log("No se pudo obtener el perfil.");
  }
});

async function getAndPrintGitHubUserProfile(username) {
  const url = `https://api.github.com/users/${username}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      const img = data.avatar_url;
      const name = data.name || "Nombre no disponible";
      const publicRepos = data.public_repos || 0;

      const profileCard = `
              <section>
                  <img src="${img}" alt="${name}"> 
                  <h1>${name}</h1>
                  <p>Public repos: ${publicRepos}</p>
              </section>
          `;

      return profileCard;
    } else {
      throw new Error("Usuario no encontrado o error en la solicitud");
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return "<p>Hubo un error al obtener el perfil de GitHub.</p>";
  }
}

async function fetchGithubUsers(userNames) {
  if (!userNames || userNames.length === 0) return [];

  const fetchPromises = userNames.map((name) =>
    fetch(`https://api.github.com/users/${name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al obtener el usuario ${name}: ${response.status}`
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Fallo con el usuario ${name}:`, error);
        return null;
      })
  );

  try {
    const usersData = await Promise.all(fetchPromises);

    const validUsers = usersData.filter((user) => user !== null);

    validUsers.forEach((user) => {
      console.log(`Nombre: ${user.name || "No disponible"}`);
      console.log(`Repos URL: ${user.repos_url}`);
      console.log("-----------------------------");
    });

    return validUsers;
  } catch (error) {
    console.error("Error general al obtener los usuarios:", error);
    throw error;
  }
}
