import { SignedIn, useUser } from '@clerk/clerk-expo';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SignOutButton } from '../../components/SignOutButton';
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTask';
import { styles } from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useRoutine } from '../../hooks/useRoutine';
import Slider from '@react-native-community/slider';

export default function Page() {
  const { user } = useUser();
  const userId = user?.id;
  const [title, setTitle] = useState('');
  const { tasks, isLoading, createTask, loadData, updateTask, deleteTask } =
    useTasks(userId);
  const {
    energyLevel,
    isLoading: isRoutineLoading,
    fetchRoutine,
    updateEnergyLevel,
  } = useRoutine(userId);
  const [sliderValue, setSliderValue] = useState(3);

  React.useEffect(() => {
    if (userId) loadData();
    if (userId) fetchRoutine();
  }, [userId]);

  const handleCreateTask = () => {
    if (!title.trim()) return;
    createTask({ title, user_id: userId, category: 'général' });
    setTitle('');
  };

  const handleToggleTask = (task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <View style={styles.transactionCard}>
      <TouchableOpacity
        style={styles.transactionContent}
        onPress={() => handleToggleTask(item)}
      >
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? COLORS.primary : COLORS.textLight}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text
            style={[
              styles.transactionTitle,
              item.completed && {
                textDecorationLine: 'line-through',
                color: COLORS.textLight,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionDate}>
            {item.completed ? 'Terminée' : 'À faire'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SignedIn>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Bonjour</Text>
                <Text style={styles.usernameText}>
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <SignOutButton />
            </View>
          </View>

          {/* Bloc énergie du jour */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Énergie du jour</Text>
            {isRoutineLoading ? (
              <Text style={styles.balanceTitle}>Chargement...</Text>
            ) : energyLevel === null ? (
              <>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={5}
                  step={1}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.textLight}
                  thumbTintColor={COLORS.primary}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    marginVertical: 8,
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  {sliderValue} / 5
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { marginTop: 8 }]}
                  onPress={() => updateEnergyLevel(sliderValue)}
                >
                  <Ionicons name="checkmark" size={20} color={COLORS.white} />
                  <Text style={styles.addButtonText}>Valider</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center', marginVertical: 8 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: COLORS.primary,
                  }}
                >
                  {energyLevel} / 5
                </Text>
                <Text style={{ color: COLORS.textLight, marginTop: 4 }}>
                  Énergie renseignée pour aujourd'hui
                </Text>
              </View>
            )}
          </View>

          {/* Formulaire création tâche */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Nouvelle tâche</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la tâche"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreateTask}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>Créer tâche</Text>
            </TouchableOpacity>
          </View>

          {/* Header des tâches */}
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionsHeaderContainer}>
              <Text style={styles.sectionTitle}>Mes tâches</Text>
              <Text style={styles.balanceStatAmount}>{tasks.length}</Text>
            </View>
          </View>

          {/* Liste des tâches */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.balanceTitle}>Chargement...</Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>Aucune tâche</Text>
              <Text style={styles.emptyStateText}>
                Commencez par créer votre première tâche pour organiser votre
                journée !
              </Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={renderTask}
              contentContainerStyle={styles.transactionsListContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SignedIn>
  );
}
