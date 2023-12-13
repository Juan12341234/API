const modalEditarCliente = new bootstrap.Modal(document.getElementById('modalEditarCliente'));
const on= (elemont, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
};

on(document, 'click', '.btnEditarCliente', e => {
    const lista = e.target.closest('tr')
    idEditar.value = lista.children[0].innerHTML;
    nombreEditar.value = lista.children[1].innerHTML;
    apellidoEditar.value = lista.children[2].innerHTML;
    edadEditar.value = lista.children[3].innerHTML;
    tipoIdentificacionEditar.value = lista.children[4].innerHTML;
    numIdentificacionEditar.value = lista.children[5].innerHTML;
    emailEditar.value = lista.children[6].innerHTML;
    modalEditarCliente.show();
});