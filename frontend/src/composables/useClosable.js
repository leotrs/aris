import { useTemplateRef } from 'vue';
import { onKeyUp, onClickOutside, useFocus } from '@vueuse/core';


export default function useClosable(
    closeFunction,
    componentRef,
    onEscape=true,
    onOutside=true,
    // onCloseButton
) {
    const { focused } = useFocus(() => componentRef.value);
    console.log(componentRef.value);
    console.log(`focused: ${focused.value}`);

    if (onEscape) {
        onKeyUp('Escape', (e) => {
            console.log(focused.value);
            if (!focused.value) return;
            e.preventDefault();
            e.stopPropagation();
            closeFunction();
        });
    };

    if (componentRef.value && onOutside) {
        onClickOutside(componentRef, (e) => {
            if (!focused.value) return;
            closeFunction();
        });
    };

    // if (componentRef.value && onCloseButton) {
    //     const button = componentRef.$refs['buttonClose'];
    //     console.log(button);
    // }
}
