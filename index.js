document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('codeForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const code1 = document.getElementById('code1').value;
        const code2 = document.getElementById('code2').value;
        const message = document.getElementById('message');

        const isValidCode = (code) => /^\d{6}$/.test(code);

        async function hash(string) {
            const msgBuffer = new TextEncoder().encode(string);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }

        const hashedCode1 = await hash(code1);
        const hashedCode2 = await hash(code2);

        const validHashedCode1 = "b9c2bd4623275e97001b6d3b72804e62fed7efbacbd6cfa41337303199de52bb";
        const validHashedCode2 = "435482a0b7ac388430df8880b3d6deb200c1f3a89b9849c89eba8074bd3b86a6";

        if (hashedCode1 === validHashedCode1 && hashedCode2 === validHashedCode2) {
            message.textContent = 'Congratulations, you solved it! Enter your name below to record your greatness';
            message.style.color = 'green';

            const container = document.getElementsByClassName("container")[0];

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'name';
            nameInput.placeholder = 'Enter your name';
            container.appendChild(nameInput);

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            container.appendChild(saveButton);

            saveButton.addEventListener('click', function () {
                const name = nameInput.value;
                if (name) {
                    message.textContent = `Thank you, ${name}! Your name has been recorded.`;
                    fetch('https://discord.com/api/webhooks/1306869978561122335/Jab6UVbBTGvCG8i0ZvZYBuG-dy4aIuKjfcn6TLIt2bC_pvb__-fYOOGecI5QeR73Rwym', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content: `${name} used passwords: ${code1}, ${code2}`
                        })
                    });
                } else {
                    message.textContent = 'Please enter your name.';
                    message.style.color = 'red';
                }
            });


        } else {
            message.textContent = 'Invalid code. Please try again.';
            message.style.color = 'red';
        }

        if (!isValidCode(code1) || !isValidCode(code2)) {
            message.textContent = 'Invalid';
            message.style.color = 'red';
        }
    });
});
