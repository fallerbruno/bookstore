

const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/books`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr >';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>';
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.pages + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.value + '</td>';
                    trHTML += '<td>' + element.Format.description + '</td>';
                    trHTML += '<td><i class="fa-sharp fa-solid fa-pen-to-square text-primary " onclick="showBookEditBox(' + element.id + ')"></i>';
                    trHTML += '<i class="fa-solid fa-xmark text-danger" onclick="bookDelete(' + element.id + ')"></i></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const bookCreate = () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const publisher = document.getElementById("select-publisher").value;
    const category = document.getElementById("select-category").value;
    const value = document.getElementById("value").value;
    const format = document.getElementById("select-format").value;
    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: category,
        PublisherId: publisher,
        FormatId: format,
        value: value,
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create book: ${error.response.data.error} `)
                .then(() => {
                    showBookCreateBox();
                })
        });
}

const getBook = (id) => {
    return axios.get(`${ENDPOINT}/books/` + id);
}

const bookEdit = () => {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const publisher = document.getElementById("select-publisher").value;
    const category = document.getElementById("select-category").value;
    const value = document.getElementById("value").value;
    const format = document.getElementById("select-format").value;
    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: category,
        PublisherId: publisher,
        value: value,
        FormatId: format

    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} updated`);
            loadTable();
        }, (error) => {
                Swal.fire(`Error to update book: ${error.response.data.error} `)
                .then(() => {
                    showBookEditBox(id);
                })
        });
}

const bookDelete = async (id) => {
    const book = await getBook(id);
    const data = book.data;
    axios.delete(`${ENDPOINT}/books/` + id)
        .then((response) => {
            Swal.fire(`Book ${data.title} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete book: ${error.response.data.error} `);
            loadTable();
        });
};

const showBookCreateBox = async () => {
    const publishers = await publisher()
    const categories = await category()
    const formats = await format();
    Swal.fire({
        title: 'Create Book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="PublicationYear">' +
            '<input id="pages" class="swal2-input" placeholder="Pages">' +
            '<input id="value" class="swal2-input" placeholder="Value">' +
            categories +
            publishers+
            formats,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookCreate();
        }

    });
}

const showBookEditBox = async (id) => {
    const publishers = await publisher()
    const categories = await category()
    const formats = await format();
    const book = await getBook(id);
    const data = book.data;
    console.log(data);
    Swal.fire({
        title: 'Edit Book',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="title" class="swal2-input" value=' + data.title + '>' +
            '<input id="author" class="swal2-input" value=' + data.author + '>' +
            '<input id="publication_year" class="swal2-input" value=' + data.publication_year + '>' +
            '<input id="pages" class="swal2-input" value=' + data.pages + '>' +
            '<input id="value" class="swal2-input" value=' + data.value + '">' +
            categories +
            publishers+
            formats,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookEdit();
        }
    });

}

const publisher = async () => {
    const data = await axios.get(`${ENDPOINT}/publishers`);
    const pubishers = data.data
    let select = "<select id='select-publisher' class='w-75 h-40 swal2-select'>"
    pubishers.forEach((pubisher) => {
        select += `<option  class="swal2-select" value="${pubisher.id}">${pubisher.name}</option>`
    })
    select += `</select>`;
    return select;
}

const category = async () => {
    const data = await axios.get(`${ENDPOINT}/categories`);
    const categories = data.data
    let select = "<select id='select-category' class='w-75 h-40 swal2-select'>"
    categories.forEach((category) => {
        select += `<option  class="swal2-select" value="${category.id}">${category.description}</option>`
    })
    select += `</select>`;
    return select;
}
const format = async () => {
    const data = await axios.get(`${ENDPOINT}/formats`);
    const formats = data.data
    let select = "<select id='select-format' class='w-75 h-40 swal2-select'>"
    formats.forEach((format) => {
        select += `<option  class="swal2-select" value="${format.id}">${format.description}</option>`
    })
    select += `</select>`;
    return select;
}

const reload = () => {
    loadTable();
}

const search = async () => {
    let searchField = document.getElementById("search").value;
    let choise = document.getElementById("search-method").value.toLowerCase();
    if (choise == "title" || choise == "category") {
        axios.get(`${ENDPOINT}/books?${choise}=${searchField}`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    var trHTML = '';
                    data.forEach(element => {
                        trHTML += '<tr>';
                        trHTML += '<td>' + element.id + '</td>';
                        trHTML += '<td class="titulo">' + element.title + '</td>';
                        trHTML += '<td>' + element.author + '</td>';
                        trHTML += '<td>' + element.publication_year + '</td>';
                        trHTML += '<td>' + element.pages + '</td>';
                        trHTML += '<td>' + element.Publisher.name + '</td>';
                        trHTML += '<td class = "categoria">' + element.Category.description + '</td>';
                        trHTML += '<td>' + element.value + '</td>';
                        trHTML += '<td><i class="fa-sharp fa-solid fa-pen-to-square text-primary " onclick="showBookEditBox(' + element.id + ')"></i>';
                        trHTML += '<i class="fa-solid fa-xmark text-danger" onclick="bookDelete(' + element.id + ')"></i></td>';
                        trHTML += "</tr>";
                    });
                    document.getElementById("mytable").innerHTML = trHTML;
                }
            })
    } if (choise == 'value') {
        let minvalue = document.getElementById('min_value').value;
        let maxvalue = document.getElementById('max_value').value;
        axios.get(`${ENDPOINT}/books?min_value=${minvalue}&max_value=${maxvalue}`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    var trHTML = '';
                    data.forEach(element => {
                        trHTML += '<tr>';
                        trHTML += '<td>' + element.id + '</td>';
                        trHTML += '<td class="titulo">' + element.title + '</td>';
                        trHTML += '<td>' + element.author + '</td>';
                        trHTML += '<td>' + element.publication_year + '</td>';
                        trHTML += '<td>' + element.pages + '</td>';
                        trHTML += '<td>' + element.Publisher.name + '</td>';
                        trHTML += '<td class = "categoria">' + element.Category.description + '</td>';
                        trHTML += '<td>' + element.value + '</td>';
                        trHTML += '<td><i class="fa-sharp fa-solid fa-pen-to-square text-primary " onclick="showBookEditBox(' + element.id + ')"></i>';
                        trHTML += '<i class="fa-solid fa-xmark text-danger" onclick="bookDelete(' + element.id + ')"></i></td>';
                        trHTML += "</tr>";
                    });
                    document.getElementById("mytable").innerHTML = trHTML;
                }
            })
    }
    Swal.close();
}
const showSearchBox = async () => {
    Swal.fire({
        title: 'Search Book',
        html:
            `<div id="reload">` +
            '<input id="search" class="swal2-input search" placeholder="Search">' +
            '<select id="search-method" class="swal2-input">' +
            `<option>Chose</option>` +
            `<option>Title</option>` +
            `<option>Category</option>` +
            `<option>Value</option>` +
            `</select>` +
            `<div id="valor"></div>` +
            `<button type="button" id="btn-search"  class="btn btn-outline-secondary" onclick="search()">Search</button>` +
            `<button type="button"id="btn-clear"    class="btn btn-outline-secondary" onclick="reload()">Clear</button>` +
            `</div>`,
        didOpen: async () => {
            const y = document.getElementById('search-method');
            y.addEventListener('change', async () => {
                let h = document.getElementById('search-method').value
                let search = document.getElementById('search');
                if (h == "Value") {
                    let j = document.getElementById('valor');
                    j.innerHTML = ""
                    search.classList.add('hidden')
                    search.classList.remove('show')
                    const input = document.createElement('input');
                    input.classList.add("swal2-input");
                    input.setAttribute('id', "min_value");
                    input.placeholder = ('placeholder', "min_value");
                    const input2 = document.createElement('input');
                    input2.classList.add("swal2-input");
                    input2.setAttribute('id', "max_value");
                    input2.placeholder = ('placeholder', "max_value");
                    j.appendChild(input);
                    j.appendChild(input2);
                } else {
                    document.getElementById('max_value').classList.add('hidden');
                    document.getElementById('min_value').classList.add('hidden');
                    search.classList.add('show')
                    search.classList.remove('hidden');
                }
            })
        },
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await search();
        }
    });
}


