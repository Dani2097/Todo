"use client";
import React, {useState, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// Styled components (Container, Title, Input rimangono gli stessi)
// Styled components
const Title = ({ children }) => (
    <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
    >
        {children}
    </motion.h1>
);

const Container = ({ children }) => (
    <div className="min-h-screen py-10 px-2 md:px-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl">
            {/* Floating shapes for parallax effect */}
            <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-300 opacity-10 rounded-full"
                animate={{
                    x: [0, -80, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
            <div className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 md:p-8 overflow-hidden">
                {children}
            </div>
        </div>
    </div>
);
const Input = ({ ...props }) => (
    <input
        {...props}
        className={`px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 ${props.className}`}
    />
);

const Button = ({ children, variant = 'default', ...props }) => {
    const baseStyle =  " px-4 md:px-6 py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg";
    const variantStyles = {
        default: "bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500",
        destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
        success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    };

    return (
        <motion.button
            className={`${baseStyle} ${variantStyles[variant]}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Emoji components
const PlusEmoji = () => <span role="img" aria-label="add">➕</span>;
const TrashEmoji = () => <span role="img" aria-label="delete">🗑️</span>;
const CheckEmoji = () => <span role="img" aria-label="complete">✅</span>;
const CircleEmoji = () => <span role="img" aria-label="incomplete">⭕</span>;
const UpEmoji = () => <span role="img" aria-label="collapse">🔼</span>;
const DownEmoji = () => <span role="img" aria-label="expand">🔽</span>;

// Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg mb-4 overflow-hidden"
        >
            <motion.div
                className="flex items-center p-4"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(todo.id)}
                    className="mr-4 text-2xl"
                >
                    {todo.completed ? <CheckEmoji /> : <CircleEmoji />}
                </motion.button>
                <span className={`flex-grow text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
          {todo.text}
        </span>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 hover:text-gray-700 mr-2 text-2xl"
                >
                    {isExpanded ? <UpEmoji /> : <DownEmoji />}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(todo.id)}
                    className="text-red-500 hover:text-red-700 text-2xl"
                >
                    <TrashEmoji />
                </motion.button>
            </motion.div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gray-100"
                    >
                        <div className="flex mb-4">
                            <Input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Add a subtask"
                                className="flex-grow mr-2"
                            />
                            <Button onClick={() => {
                                onAddSubtask(todo.id, newSubtask);
                                setNewSubtask('');
                            }} variant="success">
                                <PlusEmoji />
                            </Button>
                        </div>
                        <ul>
                            <AnimatePresence>
                                {todo.subtasks.map(subtask => (
                                    <motion.li
                                        key={subtask.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                        className="flex items-center mb-2"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onToggleSubtask(todo.id, subtask.id)}
                                            className="mr-3 text-xl"
                                        >
                                            {subtask.completed ? <CheckEmoji /> : <CircleEmoji />}
                                        </motion.button>
                                        <span className={`flex-grow ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {subtask.text}
                    </span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onDeleteSubtask(todo.id, subtask.id)}
                                            className="text-red-500 hover:text-red-700 text-xl"
                                        >
                                            <TrashEmoji />
                                        </motion.button>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Main TodoList Component
const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [initialized, setInitialized] = useState(false);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
        setInitialized(true)
    }, []);

    useEffect(() => {
        if(!initialized) return
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos, initialized]);

    const addTodo = () => {
        if (newTodo.trim() !== '') {
            setTodos([{ id: Date.now(), text: newTodo, completed: false, subtasks: [] }, ...todos]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const addSubtask = (todoId, subtaskText) => {
        if (subtaskText.trim() !== '') {
            setTodos(todos.map(todo =>
                todo.id === todoId
                    ? { ...todo, subtasks: [...todo.subtasks, { id: Date.now(), text: subtaskText, completed: false }] }
                    : todo
            ));
        }
    };

    const toggleSubtask = (todoId, subtaskId) => {
        setTodos(todos.map(todo =>
            todo.id === todoId
                ? { ...todo, subtasks: todo.subtasks.map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                    ) }
                : todo
        ));
    };

    const deleteSubtask = (todoId, subtaskId) => {
        setTodos(todos.map(todo =>
            todo.id === todoId
                ? { ...todo, subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId) }
                : todo
        ));
    };
    const exportTodos = () => {
        const dataStr = JSON.stringify(todos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'todos.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importTodos = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedTodos = JSON.parse(e.target.result);
                    setTodos( prev=>[...prev, ...importedTodos.map((todo,i) => ({ ...todo, id: Date.now()+"_"+i }))]);
                    localStorage.setItem('todos', JSON.stringify([...todos, ...importedTodos]));
                } catch (error) {
                    console.error('Error parsing imported file:', error);
                    alert('Error importing todos. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    return (
        <Container>
            <Title>✨ Todo List ✨</Title>
            <motion.div
                className="flex mb-8"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
            >
                <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What's your next amazing task? 🚀"
                    className="flex-grow mr-4"
                />
                <Button onClick={addTodo}>
                    <PlusEmoji/>
                </Button>
            </motion.div>
            <motion.div className="flex justify-between mb-8">
                <Button onClick={exportTodos} variant="success">
                    Export Todos 📤
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={importTodos}
                    style={{display: 'none'}}
                    accept=".json"
                />
                <Button onClick={() => fileInputRef.current.click()} variant="default">
                    Import Todos 📥
                </Button>
            </motion.div>
            <motion.div
                className="space-y-4"
                variants={{
                    hidden: {opacity: 0},
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                <AnimatePresence>
                    {todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onAddSubtask={addSubtask}
                            onToggleSubtask={toggleSubtask}
                            onDeleteSubtask={deleteSubtask}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </Container>
    );
};

export default TodoList;