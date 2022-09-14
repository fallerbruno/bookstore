const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/formats`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.description + '</td>';
                    trHTML += '<td><i class="fa-sharp fa-solid fa-pen-to-square text-primary " onclick="showFormatEditBox(' + element.id + ')"></i>';
                    trHTML += '<i class="fa-solid fa-xmark text-danger" onclick="formatDelete(' + element.id + ')"></i></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const formatCreate = () => {
    const description = document.getElementById("description").value;

    axios.post(`${ENDPOINT}/formats`, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`Format ${response.data.description} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create Format: ${error.response.data.error} `)
                .then(() => {
                    showFormatCreateBox();
                })
        });
}

const getFormat = (id) => {
    return axios.get(`${ENDPOINT}/formats/` + id);
}

const formatEdit = () => {
    const id = document.getElementById("id").value;
    const description = document.getElementById("description").value;

    axios.put(`${ENDPOINT}/formats/` + id, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`State ${response.data.description} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update State: ${error.response.data.error} `)
                .then(() => {
                    showFormatEditBox(id);
                })
        });
}

const formatDelete = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    axios.delete(`${ENDPOINT}/formats/` + id)
        .then((response) => {
            Swal.fire(`Format ${data.description} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete Format: ${error.response.data.error} `);
            loadTable();
        });
};

const showFormatCreateBox = () => {
    Swal.fire({
        title: 'Create Format',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="Description">', 
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatCreate();
        }
    });
}

const showFormatEditBox = async (id) => {
    const state = await getFormat(id);
    const data = state.data;
    Swal.fire({
        title: 'Edit State',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="Name" value="' + data.description + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatEdit();
        }
    });

}
