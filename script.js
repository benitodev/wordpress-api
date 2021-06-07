

const d = document,
w = window,
$site = d.getElementById("site"),
$posts = d.getElementById("posts"),
$loader = d.querySelector(".loader"),
$template = d.getElementById("post-template").content,
$fragment = d.createDocumentFragment(),
DOMAIN = "https://css-tricks.com",
SITE = `${DOMAIN}/wp-json`,
API_WP = `${SITE}/wp/v2`,
POSTS = `${API_WP}/posts?_embed`,
PAGES = `${API_WP}/pages`,
CATEGORIES = `${API_WP}/categories`;

let page = 1,
per_page = 5;

const getWp = async() =>{
  try {
   

    res = await fetch(SITE),
    json = await res.json();
    
    if(!res.ok){throw{
      status: res.status,
      statusText: res.statusText
    }}
    $site.innerHTML = `
    <h3>Sitio web</h3>
    <h2>
    <a href="${json.url}" target="_blank">${json.name}</a>
    </h2>
    <p>${json.description}</p>
    <p>${json.timezone_string}</p>
    `

  } catch (err) {
    let message = err.statusText || "Ocurrió un error al llamar a los sitios"
    $site.innerHTML = `Error ${err.status} : ${message}`;
  }
  console.log(json)
}

const getPosts = async() =>{
  try {
    $loader.style.display = "block";
    res = await fetch(`${POSTS}&page=${page}&per_page=${per_page}`),
    json = await res.json();
    
    if(!res.ok){throw{
      status: res.status,
      statusText: res.statusText
    }}

    json.forEach(el => {
      let categories = "",
      tags = "";
      
      el._embedded["wp:term"][0].forEach(el => categories += `<li>${el.name}</li>`)
      el._embedded["wp:term"][1].forEach(el => tags += `<li>${el.name}</li>`)

      $template.querySelector(".post-title").innerHTML = el.title.rendered;
      $template.querySelector(".post-image").src = el._embedded["wp:featuredmedia"] ? el._embedded["wp:featuredmedia"][0].source_url : "No tiene imagen el post";
      $template.querySelector(".post-author").innerHTML = `<img src="${el._embedded.author[0].avatar_urls["48"]}" alt="${el._embedded.author[0].name}" >
      <figcaption>${el._embedded.author[0].name}</figcaption>`
      $template.querySelector(".post-date").innerHTML = `${new Date(el.date).toLocaleString()}`;

      $template.querySelector(".post-link").href = el.guid.rendered;
      $template.querySelector(".post-excerpt").innerHTML = el.excerpt.rendered.replace("[&hellip;]", "...");
      $template.querySelector(".post-categories").innerHTML = `<p>Categorias:</p>
      <ul>${categories}</ul>`;
      $template.querySelector(".post-tags").innerHTML = `
      <p>Tags:</p>
      <ul>${tags}</ul>`;

      $template.querySelector(".post-content > article").innerHTML = el.content.rendered;

      let $clone = d.importNode($template, true)
      $fragment.appendChild($clone);


    });




    
    $posts.appendChild($fragment);


    $loader.style.display = "none";
  } catch (err) {
    let message = err.statusText || "Ocurrió un error al llamar a los posts"
    $posts.innerHTML = `Error ${err.status} : ${message}`;
    $loader.style.display = "none";
  }
  console.log(json)
}

d.addEventListener("DOMContentLoaded", e =>{
  getWp();
  getPosts();

});

w.addEventListener("scroll", e =>{
  let {scrollTop, clientHeight, scrollHeight} = d.documentElement;

  let documento = d.documentElement
  
  // console.log(scrollTop, clientHeight, scrollHeight)

  if(scrollTop + clientHeight + 300 >= scrollHeight){
    console.log("Cargar más")
    page++;
    getPosts();
  }
})

