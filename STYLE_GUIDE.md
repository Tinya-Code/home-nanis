# 🎨 NUEVA GUÍA DE ESTILO — El Hogar de Nanis
> Minimalismo · Calidez · UX/UI de Confianza  
> Principios: Limpieza, Claridad, Empatía.

---

## 1. Filosofía de Diseño: "Hogar Moderno"

A diferencia de la guía anterior, este nuevo ADN visual huye de lo tecnológico para abrazar lo humano.

- **Minimalismo cálido**: Espacios amplios pero acogedores. No es "vacío", es "ordenado".
- **Sin ornamentos**: Se eliminan gradientes en textos, sombras neón y efectos futuristas.
- **Geometría suave**: El redondeo por defecto es `sm` (2px - 4px) para transmitir orden y precisión. El redondeo `full` se reserva para elementos que necesitan suavidad extrema (avatares, botones circulares).

---

## 2. Tokens de Diseño (Alineados con @810FC9 y #F1F1F1)

### Colores
- **Marca Principal**: `#810FC9` (Púrpura del Logo). Usado para acentos críticos y símbolos.
- **Base Neutra**: `#F1F1F1` (Gris Perla). Es el color de fondo principal para secciones, aportando suavidad.
- **Acción Secundaria**: Un tono derivado del púrpura o un gris profundo para mantener la sobriedad.
- **Texto**: `#1C1917` (Stone 900) para máxima legibilidad y calidez.

### Bordes y Sombras
- **Rounding**: `rounded-sm` es el estándar.
- **Shadows**: Prácticamente inexistentes o extremadamente sutiles (`shadow-sm`). La profundidad se da por contraste de color, no por sombras.

---

## 3. UX/UI y Tipografía

- **Títulos**: *Plus Jakarta Sans*. Limpio, moderno. Siempre en color sólido.
- **Cuerpo**: *Nunito*. Aporta la calidez humana necesaria por su ligera forma redondeada.
- **White Space**: Generoso. Cada componente debe respirar.
- **Interactividad**: Efectos de hover suaves (cambio de color sólido o ligero desplazamiento), sin animaciones complejas.

---

## 4. Componentes Críticos

### Botones
- Estilo sólido con `rounded-full` (si es un CTA muy humano) o `rounded-sm` (si es un formulario serio).
- Sin gradientes. Color plano con hover sutil.

### Tarjetas (Cards)
- Fondo blanco sobre fondo `#F1F1F1`.
- Borde fino (`border-border`) o sin borde con un ligero cambio de tono de fondo.
- Redondeo `rounded-sm`.

---

## 5. Checklist Minimalista
- [ ] ¿Hay gradientes en el texto? (Si sí, eliminar).
- [ ] ¿Hay sombras exageradas? (Si sí, simplificar).
- [ ] ¿El redondeo es mayor a `sm` innecesariamente? (Si sí, ajustar).
- [ ] ¿El diseño se siente cálido y profesional?
