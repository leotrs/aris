import { useTemplateRef } from 'vue';
import { onKeyUp, onClickOutside } from '@vueuse/core';

export default function useClosable(
    closeFunction,
    componentRef=null,
    onEscape=true,
    onOutside=true,
    // onCloseButton
) {
    if (onEscape) {
        onKeyUp('Escape', (e) => {
            e.preventDefault();
            closeFunction();
        })
    };

    if (componentRef.value && onOutside) {
        onClickOutside(componentRef, (e) => {
            closeFunction();
        })
    };

    // if (componentRef.value && onCloseButton) {
    //     const button = componentRef.$refs['buttonClose'];
    //     console.log(button);
    // }
}
