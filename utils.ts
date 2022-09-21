export const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const getCurrentDate = () => {
    const date = new Date().toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
    });

    return `Updated on: ${date}`;
};

export const formatTitle = (title: string) => {
    const newTitle = title.split('-')[0];
    return newTitle;
};
