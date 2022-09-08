const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/books`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>';
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.pages + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="bookDelete(' + element.id + ')">Del</button></td>';
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

    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: category,
        PublisherId: publisher,
    })
        .then((response) => {
            Swal.fire(`Book ${response.data.name} created`);
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
    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        CategoryId: category,
        PublisherId: publisher,

    })
        .then((response) => {
            Swal.fire(`Book ${response.data.name} updated`);
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
            Swal.fire(`Book ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete book: ${error.response.data.error} `);
            loadTable();
        });
};

const showBookCreateBox = async () => {
    const publishers = await publisher()
    const categories = await category()
    console.log(categories);
    Swal.fire({
        title: 'Create Book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="PublicationYear">' +
            '<input id="pages" class="swal2-input" placeholder="Pages">' +
            categories +
            publishers,
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
    const book = await getBook(id);
    const data = book.data;
    console.log(data);
    Swal.fire({
        title: 'Edit Publisher',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="title" class="swal2-input" value=' + data.title + '>' +
            '<input id="author" class="swal2-input" value=' + data.author + '>' +
            '<input id="publication_year" class="swal2-input" value=' + data.publication_year + '>' +
            '<input id="pages" class="swal2-input" value=' + data.pages + '>' +
            categories +
            publishers,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => { console.log(y)
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


