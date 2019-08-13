class Card {
    constructor(name, img) {
        this._mainElement = document.querySelector('.cards');
        this.name = name;
        this.img = img;

        this.createElement(name, img);
    }

    createElement(name, imgName) {

        if (this.checkUniqueness(name)) {
            return 
        }
        const article = document.createElement('article');
        const header = document.createElement('header');
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const img = new Image();

        article.className = 'card';
        header.className = 'card__name';
        div.className = "card__about";
        img.className = "card__about__img";
        h3.innerText = name;
        img.src = imgName;

        header.append(h3);
        div.append(img);
        article.append(header, div);

        Card._elements[name] = article;
        this._mainElement.append(article);
    };

    checkUniqueness(name) {
        for (let key in Card._elements) {
            if (key === name) {
                alert(`У Вас есть такой элемент ----  ${name}`);
                return true
            }
        }
        
    }
}
Card._elements = {};

class AsideMenu {
    constructor({ mainElement }) {
        this._cards = Array.from(mainElement.querySelectorAll('.card'));
        this._mainElement = mainElement;
        this._search = mainElement.querySelector('.search__input');
        this._dragObject = {};

        document.addEventListener('click', (e) => {
            const target = e.target;

            if (target.closest(".aside-menu__arrow")) {
                console.log(mainElement)
                this._mainElement.classList.toggle('active')
            }
        })

        //START: DRAG AND DROP
        document.addEventListener('mousedown', (e) => {
            const target = e.target.closest(".card");



            if (!target) return;

            this._dragObject.elem = target;
            this._dragObject.x = e.pageX;
            this._dragObject.y = e.pageY;
            this._dragObject.height = target.offsetHeight;
            this._dragObject.width = target.offsetWidth;
            this._dragObject.name = target.firstElementChild.firstElementChild.innerText; // Не самый лучший вариант выбора элемента :(         
        })

        document.addEventListener('mousemove', (e) => {
            if (!this._dragObject.elem) return;

            if (!this._dragObject.avatar) {
                let moveX = e.pageX - this._dragObject.x;
                let moveY = e.pageY - this._dragObject.y;
                if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) {
                    return;
                }

                this._dragObject.avatar = this.createAvatar(); // захватить элемент
                if (!this._dragObject.avatar) {
                    this._dragObject = {}; // аватар создать не удалось, отмена переноса
                    return; // возможно, нельзя захватить за эту часть элемента
                }

                // аватар создан успешно
                // создать вспомогательные свойства shiftX/shiftY
                let { left, top } = this._dragObject.avatar.getBoundingClientRect();
                this._dragObject.shiftX = this._dragObject.x - left + pageXOffset;
                this._dragObject.shiftY = this._dragObject.y - top + pageXOffset;

                this.startDrag();


            }
            this._dragObject.avatar.style.left = e.pageX - this._dragObject.shiftX + 'px';
            this._dragObject.avatar.style.top = e.pageY - this._dragObject.shiftY + 'px';

            e.preventDefault();

        });

        document.addEventListener('mouseup', (e) => {
            if (this._dragObject.avatar) {
                this.finishDrag(e);
            }

            this._dragObject = {};
        });
        //END


        this._search.oninput = (e) => {
            this.searchElement(e.currentTarget.value)

            console.log(e.currentTarget)
        }

        this._mainElement.ondragstart = () => false;
    };

    createAvatar() {
        let avatar = this._dragObject.elem;
        let old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        avatar.rollback = () => {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };

        return avatar;
    };

    startDrag() {
        let avatar = this._dragObject.avatar;

        this._mainElement.querySelector('.cards').appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    };

    finishDrag(e) {
        if (this.checkDragElement(e)) {
            const button = document.createElement('button');

            button.innerText = this._dragObject.name;
            button.style.cssText = `position: fixed;
                                    height: ${this._dragObject.height}px;
                                    width: ${this._dragObject.width}px;
                                    left: ${this._dragObject.avatar.getBoundingClientRect().left}px;
                                    top: ${this._dragObject.avatar.getBoundingClientRect().top}px;`

            this._dragObject.elem.replaceWith(button)
        } else {
            this._dragObject.avatar.rollback();
        }
        this._dragObject = {};
    };

    checkDragElement(e) {
        const mainElementRight = this._mainElement.getBoundingClientRect().right + this._dragObject.shiftX;

        if (e.pageX < mainElementRight) {
            const elem = this._dragObject.elem;
            elem.classList.add('warning');


            setTimeout(() => {
                elem.classList.remove('warning');
            }, 1000)

            return false
        }
        return true;
    };

    searchElement(text) {
        this._cards.forEach(item => {
            let name = item.querySelector('.card__name').innerText;

            if (name.includes(text)) item.hidden = false;
            else item.hidden = true;

        })
    }

}

new Card("Virtual", './images/v.svg');
new Card("Office", './images/mo.svg');
new Card("Notify", './images/notify.svg');
new Card("Post", './images/post.svg');
new Card("Word", './images/word.svg');




new AsideMenu({
    mainElement: document.querySelector('.aside-menu')
})







