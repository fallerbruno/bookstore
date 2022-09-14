

const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/publishers`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.City.name + '</td>';
                    trHTML += '<td>' + element.City.State.province + '</td>';
                    trHTML += '<td><i class="fa-sharp fa-solid fa-pen-to-square text-primary " onclick="showPublisherEditBox(' + element.id + ')"></i>';
                    trHTML += '<i class="fa-solid fa-xmark text-danger" onclick="publisherDelete(' + element.id + ')"></i></td>';
                    trHTML += "</tr>";
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const publisherCreate = () => {
    const name = document.getElementById("name").value;
    const CityId = document.getElementById("select-city").value;
    axios.post(`${ENDPOINT}/publishers`, {
        name: name,
        CityId: CityId,
    })
        .then((response) => {
            Swal.fire(`publisher ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherCreateBox();
                })
        });
}

const getPublisher = (id) => {
    return axios.get(`${ENDPOINT}/publishers/` + id);
}

const publisherEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const CityId = document.getElementById("select-city").value;
    axios.put(`${ENDPOINT}/publishers/` + id, {
        name: name,
        CityId: CityId,
    })
        .then((response) => {
            Swal.fire(`Publisher ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherEditBox(id);
                })
        });
}

const publisherDelete = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
    axios.delete(`${ENDPOINT}/publishers/` + id)
        .then((response) => {
            Swal.fire(`Publisher ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete publisher: ${error.response.data.error} `);
            loadTable();
        });
};

const showPublisherCreateBox = async () => {
    const state = await states();
    Swal.fire({
        title: 'Create publisher',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            state +
            "<select id='select-city' class='w-75 h-40 swal2-select'>",
        didOpen: async () => {
            const y = document.getElementById('select-state');
            y.addEventListener('change', async () => {
                let h = document.getElementById('select-city')
                h.innerHTML = ""
                const x = await cities(y.value);
            })
        },
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => {
                    publisherCreate();
                }

    });
}

const showPublisherEditBox = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
    const state = await states();
    Swal.fire({
        title: 'Edit Publisher',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">'+
            state+
            "<select id='select-city' class='w-75 h-40 swal2-select'>",
            didOpen: async () => {
                const y = document.getElementById('select-state');
                y.addEventListener('change', async () => {
                    let h = document.getElementById('select-city')
                    h.innerHTML = ""
                    const x = await cities(y.value);
                })
            },
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            publisherEdit();
        }
    });

}

const states = async () => {
    const data = await axios.get(`${ENDPOINT}/states`);
    const states = data.data
    let select = "<select id='select-state'  class='w-75 h-40 swal2-select'>"+
    `<option  class="swal2-select">Select a State</option>`
    states.forEach((state) => {
        select += `<option  class="swal2-select" onclick='cities(this.value)'   value="${state.id}">${state.name}</option>`
    })
    select += `</select>`;
    return select;
}

const cities = async (y) => {
    const data = await axios.get(`${ENDPOINT}/cities?StateId=${y}`);
    const city = data.data
    const select = document.getElementById('select-city');
    city.forEach((city) => {
        const option = document.createElement('option');
        option.classList.add("swal2-select");
        option.setAttribute('value', city.id);
        option.textContent = city.name;
        select.appendChild(option);
    })
    return select;
}


