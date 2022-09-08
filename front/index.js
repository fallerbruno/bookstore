const ENDPOINT = "http://localhost:3000";

const validateUser = (login, password) => {
    let validate = false;
    axios.get(`${ENDPOINT}/users`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                data.forEach(user => {
                    console.log(user.email);
                    if (user.email == login && user.password == MD5(password)) {
                        window.open(`./menu/index.html`,'_self');
                        validate = true;
                    }
                });
                if (validate === false) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        preConfirm: () => {
                        }
                    })
                }
            }
        })
};