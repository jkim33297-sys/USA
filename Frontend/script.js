const shoppingInput = document.getElementById("shoppingInput");

const searchButton = document.getElementById("searchButton");

const quickButtons = document.querySelectorAll(".quick-search-btn");

const ctaButton = document.getElementById("ctaButton");


function performSearch(query) {

    query = query.trim();


    if (query === "") {

        alert("Tell USA what you're looking for first!");

        shoppingInput.focus();

        return;

    }


    localStorage.setItem("usaSearchQuery", query);


    window.location.href = "Pages/search/search.html";

}



if (searchButton) {

    searchButton.addEventListener("click", function () {

        performSearch(shoppingInput.value);

    });

}



quickButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const query = button.dataset.search;

        shoppingInput.value = query;

        performSearch(query);

    });

});



if (shoppingInput) {

    shoppingInput.addEventListener("keydown", function(event) {

        if (event.ctrlKey && event.key === "Enter") {

            event.preventDefault();

            performSearch(shoppingInput.value);

        }

    });

}



if (ctaButton) {

    ctaButton.addEventListener("click", function() {

        shoppingInput.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}